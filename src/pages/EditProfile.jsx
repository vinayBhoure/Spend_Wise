import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Loader2, CheckCircle, AlertCircle, User, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/layout/PageHeader';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, profileUpdating, updateProfileDetails, clearError } = useProfile(true);

  const fileInputRef = useRef(null);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fieldError, setFieldError] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Initialize form once profile loads
  React.useEffect(() => {
    if (profile && !initialized) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
      setInitialized(true);
    }
  }, [profile, initialized]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFieldError('Only JPEG, PNG, WebP, and GIF images are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFieldError('Image must be smaller than 2 MB.');
      return;
    }

    setFieldError('');
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFieldError('');
      clearError();

      const trimmedUsername = username.trim();
      const trimmedFullName = fullName.trim();

      if (!trimmedUsername && !trimmedFullName && !avatarFile) {
        setFieldError('Please update at least one field.');
        return;
      }

      try {
        await updateProfileDetails({
          username: trimmedUsername || undefined,
          fullName: trimmedFullName || undefined,
          avatarFile: avatarFile || undefined,
        });
        toast.success('Profile updated successfully!');
        navigate('/profile');
      } catch (err) {
        toast.error(err?.message || 'Failed to update profile. Please try again.');
      }
    },
    [username, fullName, avatarFile, updateProfileDetails, navigate, clearError]
  );

  const currentAvatarUrl = avatarPreview || profile?.avatar_url || null;
  const displayName =
    profile?.full_name || profile?.username || user?.user_metadata?.full_name || 'User';

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-dark font-manrope antialiased">
      <PageHeader 
        title="Edit Profile"
        showBack={true}
        onBack={() => navigate('/profile')}
        rightElement={
          <div className="text-primary font-bold text-xl tracking-tight pr-2">SpendWise</div>
        }
      />

      {/* Main Content */}
      <main className="flex-1 px-6 pt-8 pb-10 overflow-y-auto">
        <form id="edit-profile-form" onSubmit={handleSubmit} noValidate>
          {/* Avatar Picker */}
          <section className="flex flex-col items-center mb-10">
            <div className="relative group mb-4">
              <div className="w-28 h-28 rounded-full border-2 border-primary/30 p-1 bg-card-dark overflow-hidden">
                {currentAvatarUrl ? (
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${currentAvatarUrl}")` }}
                    role="img"
                    aria-label="Profile photo preview"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="size-12 text-primary/40" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Camera button overlay */}
              <button
                id="edit-profile-avatar-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={profileUpdating}
                className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform disabled:opacity-50"
                aria-label="Change profile photo"
              >
                <Camera className="size-4" strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              id="edit-profile-change-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={profileUpdating}
              className="text-primary text-sm font-semibold flex items-center gap-1.5 hover:text-primary/80 transition-colors disabled:opacity-50"
            >
              <Pencil className="size-3.5" />
              {avatarFile ? 'Change Photo' : 'Upload Photo'}
            </button>

            {avatarFile && (
              <p className="text-xs text-slate-500 mt-1.5">{avatarFile.name}</p>
            )}

            <input
              ref={fileInputRef}
              id="edit-profile-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload profile photo"
            />
          </section>

          {/* Fields */}
          <section className="space-y-5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">
              Personal Info
            </h3>

            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="edit-profile-fullname"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
                <input
                  id="edit-profile-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={displayName}
                  maxLength={60}
                  disabled={profileUpdating}
                  className="w-full bg-card-dark border border-white/8 rounded-xl pl-11 pr-4 py-3.5 text-slate-100 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="edit-profile-username"
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none select-none">
                  @
                </span>
                <input
                  id="edit-profile-username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))
                  }
                  placeholder={profile?.username || 'your_username'}
                  maxLength={30}
                  disabled={profileUpdating}
                  className="w-full bg-card-dark border border-white/8 rounded-xl pl-9 pr-4 py-3.5 text-slate-100 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                />
              </div>
              <p className="text-[11px] text-slate-600 ml-1">
                Lowercase letters, numbers, underscores, dots and hyphens only.
              </p>
            </div>

            {/* Field-level error */}
            {fieldError && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                <AlertCircle className="size-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive font-medium">{fieldError}</p>
              </div>
            )}
          </section>

          {/* Email (read-only) */}
          <section className="mt-8 space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 mb-3">
              Account
            </h3>
            <div className="bg-card-dark border border-white/5 rounded-xl px-4 py-3.5 flex items-center gap-3">
              <CheckCircle className="size-4 text-primary/60 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Email</p>
                <p className="text-sm text-slate-300 font-medium mt-0.5">
                  {user?.email || '—'}
                </p>
              </div>
              <span className="ml-auto text-[10px] text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Verified
              </span>
            </div>
          </section>

          {/* Save Button */}
          <div className="mt-10">
            <button
              id="edit-profile-save-btn"
              type="submit"
              disabled={profileUpdating}
              className="w-full bg-primary text-background-dark font-extrabold text-sm rounded-xl py-4 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {profileUpdating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving Changes…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
