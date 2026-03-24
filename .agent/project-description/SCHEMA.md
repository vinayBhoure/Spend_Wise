# SpendWise DB Schema — Phase 1

## Execution order
Extensions → set_updated_at fn → profiles → accounts → categories → transactions → sync_queue → recalculate_account_balance trigger → seed_default_categories fn → handle_new_user (updated) → indexes

---

## Extensions
```sql
create extension if not exists "uuid-ossp";
```

---

## Shared trigger function
```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
```

---

## profiles
- FK to auth.users(id)
- currency: user preference (INR default)
- no dark_mode column — handled client-side via prefers-color-scheme

```sql
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text,
  email      text,
  role       text not null default 'user',
  full_name  text,
  avatar_url text,
  currency   text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, currency)
  values (new.id, new.email, 'INR');
  perform public.seed_default_categories(new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
create policy "profiles:select" on public.profiles for select using (auth.uid() = id);
create policy "profiles:update" on public.profiles for update using (auth.uid() = id);
```

---

## accounts
- current_balance: maintained by trigger, never set by client
- exclude_from_transactions: balance excluded from dashboard net total; transactions still visible in list
- is_archived: hides from active list, transactions retained

```sql
create type account_type as enum ('bank', 'cash', 'upi', 'credit_card');

create table public.accounts (
  id                        uuid primary key default uuid_generate_v4(),
  user_id                   uuid not null references public.profiles(id) on delete cascade,
  name                      text not null,
  type                      account_type not null,
  initial_balance           numeric(14,2) not null default 0,
  current_balance           numeric(14,2) not null default 0,
  currency                  text not null default 'INR',
  is_archived               boolean not null default false,
  exclude_from_transactions boolean not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create trigger accounts_updated_at
  before update on public.accounts
  for each row execute procedure public.set_updated_at();

alter table public.accounts enable row level security;
create policy "accounts:select" on public.accounts for select using (auth.uid() = user_id);
create policy "accounts:insert" on public.accounts for insert with check (auth.uid() = user_id);
create policy "accounts:update" on public.accounts for update using (auth.uid() = user_id);
create policy "accounts:delete" on public.accounts for delete using (auth.uid() = user_id);
```

---

## categories
- is_deletable=false: seeded system category, blocked from update/delete at DB level
- is_deletable=true: user-created, fully editable

```sql
create type category_type as enum ('income', 'expense');

create table public.categories (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  name         text not null,
  emoji        text not null,
  type         category_type not null,
  is_deletable boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.categories enable row level security;
create policy "categories:select" on public.categories for select using (auth.uid() = user_id);
create policy "categories:insert" on public.categories for insert with check (auth.uid() = user_id);
create policy "categories:update" on public.categories for update using (auth.uid() = user_id and is_deletable = true);
create policy "categories:delete" on public.categories for delete using (auth.uid() = user_id and is_deletable = true);
```

### Seed function
```sql
create or replace function public.seed_default_categories(p_user_id uuid)
returns void as $$
begin
  insert into public.categories (user_id, name, emoji, type, is_deletable) values
    (p_user_id, 'Food & Drinks',        '🍔', 'expense', false),
    (p_user_id, 'Housing / Rent',       '🏠', 'expense', false),
    (p_user_id, 'Transportation',       '🚌', 'expense', false),
    (p_user_id, 'Shopping',             '🛍️', 'expense', false),
    (p_user_id, 'Subscriptions',        '📱', 'expense', false),
    (p_user_id, 'Utilities',            '💡', 'expense', false),
    (p_user_id, 'Health',               '❤️', 'expense', false),
    (p_user_id, 'Vehicles',             '🚗', 'expense', false),
    (p_user_id, 'Life & Entertainment', '🎉', 'expense', false),
    (p_user_id, 'Communication & PC',   '💻', 'expense', false),
    (p_user_id, 'Financial Expense',    '💸', 'expense', false),
    (p_user_id, 'Investments',          '📈', 'expense', false),
    (p_user_id, 'Other',                '📦', 'expense', false),
    (p_user_id, 'Salary',               '💼', 'income',  false),
    (p_user_id, 'Freelance',            '🧑‍💻', 'income', false),
    (p_user_id, 'Gift',                 '🎁', 'income',  false),
    (p_user_id, 'Returns',              '🔄', 'income',  false),
    (p_user_id, 'Interest & Dividend',  '🏦', 'income',  false),
    (p_user_id, 'Lending & Renting',    '🤝', 'income',  false),
    (p_user_id, 'Refunds',              '↩️', 'income',  false),
    (p_user_id, 'Others',               '📦', 'income',  false);
end;
$$ language plpgsql security definer;
```

---

## transactions
- category_id: null for transfers
- transfer_to_account_id: null for income/expense
- synced=false: written offline, pending server confirmation
- amount: must be > 0

```sql
create type transaction_type as enum ('income', 'expense', 'transfer');

create table public.transactions (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references public.profiles(id) on delete cascade,
  account_id             uuid not null references public.accounts(id) on delete cascade,
  category_id            uuid references public.categories(id) on delete set null,
  transfer_to_account_id uuid references public.accounts(id) on delete set null,
  type                   transaction_type not null,
  amount                 numeric(14,2) not null check (amount > 0),
  date                   date not null default current_date,
  time                   time,
  note                   text,
  is_transfer            boolean not null default false,
  synced                 boolean not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.set_updated_at();

alter table public.transactions enable row level security;
create policy "transactions:select" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions:insert" on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions:update" on public.transactions for update using (auth.uid() = user_id);
create policy "transactions:delete" on public.transactions for delete using (auth.uid() = user_id);
```

### Balance recalculation trigger
```sql
create or replace function public.recalculate_account_balance()
returns trigger as $$
declare v_account_id uuid;
begin
  v_account_id := case when TG_OP = 'DELETE' then old.account_id else new.account_id end;
  update public.accounts
  set current_balance = initial_balance + coalesce((
    select sum(case
      when type = 'income' then amount
      when type = 'expense' then -amount
      when type = 'transfer' and account_id = v_account_id then -amount
      when type = 'transfer' and transfer_to_account_id = v_account_id then amount
      else 0
    end)
    from public.transactions
    where account_id = v_account_id or transfer_to_account_id = v_account_id
  ), 0)
  where id = v_account_id;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger accounts_recalculate_balance
  after insert or update or delete on public.transactions
  for each row execute procedure public.recalculate_account_balance();
```

---

## sync_queue
- Stores pending operations from offline sessions
- Service worker flushes rows where processed=false on reconnect

```sql
create type sync_operation as enum ('insert', 'update', 'delete');
create type sync_entity    as enum ('transactions', 'accounts', 'categories');

create table public.sync_queue (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  entity_type  sync_entity not null,
  entity_id    uuid not null,
  operation    sync_operation not null,
  payload      jsonb not null default '{}',
  processed    boolean not null default false,
  queued_at    timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.sync_queue enable row level security;
create policy "sync_queue:select" on public.sync_queue for select using (auth.uid() = user_id);
create policy "sync_queue:insert" on public.sync_queue for insert with check (auth.uid() = user_id);
create policy "sync_queue:update" on public.sync_queue for update using (auth.uid() = user_id);
create policy "sync_queue:delete" on public.sync_queue for delete using (auth.uid() = user_id);
```

---

## Indexes
```sql
create index idx_accounts_user_id        on public.accounts(user_id);
create index idx_categories_user_id      on public.categories(user_id);
create index idx_categories_type         on public.categories(type);
create index idx_transactions_user_id    on public.transactions(user_id);
create index idx_transactions_account_id on public.transactions(account_id);
create index idx_transactions_date       on public.transactions(date desc);
create index idx_transactions_type       on public.transactions(type);
create index idx_sync_queue_user_id      on public.sync_queue(user_id);
create index idx_sync_queue_processed    on public.sync_queue(processed) where processed = false;
```

---

## Currencies
INR, USD, EUR, GBP, JPY, KRW, AUD, CAD