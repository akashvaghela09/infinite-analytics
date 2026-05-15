import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Link,
  Upload,
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Key,
  Globe,
  AlertCircle,
} from "lucide-react";
import api from "../../api/axiosInstance";
import PageWrapper from "../../components/common/PageWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";
import Tabs from "../../components/common/Tabs";
import Card from "../../components/common/Card";
import { updateUser } from "../../redux/auth/authSlice";
import { appToast } from "../../redux/app/appSlice";

const EditProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const hasLocalProvider = user?.providers?.includes("local");
  const hasGoogleProvider = user?.providers?.includes("google");

  const [photoTab, setPhotoTab] = useState("upload");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const {
    name,
    email,
    bio,
    phone,
    currentPassword,
    password,
    confirmPassword,
  } = formData;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPhotoPreview(url);
  };

  const uploadPhotoIfNeeded = async () => {
    if (!photoPreview) return null;

    if (photoTab === "upload" && imageFile) {
      const fd = new FormData();
      fd.append("image", imageFile);
      const response = await api.post("/user/photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.user.photo;
    } else if (photoTab === "url" && imageUrl) {
      const response = await api.post("/user/photo", { imageUrl });
      return response.data.user.photo;
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fieldsToUpdate = { name, email, bio, phone };

    if (password) {
      if (password !== confirmPassword) {
        setLoading(false);
        return dispatch(appToast.error("Passwords do not match"));
      }
      if (password.length < 8) {
        setLoading(false);
        return dispatch(appToast.error("Password must be at least 8 characters"));
      }
      fieldsToUpdate.password = password;
      if (hasLocalProvider) {
        if (!currentPassword) {
          setLoading(false);
          return dispatch(appToast.error("Current password is required"));
        }
        fieldsToUpdate.currentPassword = currentPassword;
      }
    }

    try {
      let photoUrl = await uploadPhotoIfNeeded();

      const response = await api.put("/user/profile", fieldsToUpdate);
      const updatedUser = response.data.user;

      if (photoUrl) {
        updatedUser.photo = photoUrl;
        setPhotoPreview(null);
        setImageFile(null);
        setImageUrl("");
      }

      dispatch(updateUser(updatedUser));
      dispatch(appToast.success("Profile updated successfully"));
      navigate("/profile");
    } catch (error) {
      dispatch(appToast.error(error.response?.data?.message || "Failed to update profile"));
    } finally {
      setLoading(false);
    }
  };

  const photoTabs = [
    { label: "Upload", value: "upload", icon: Upload },
    { label: "URL", value: "url", icon: Link },
  ];

  return (
    <PageWrapper
      title="Edit Profile"
      description="Update your profile information"
      actions={
        <Button
          variant="ghost"
          leftIcon={ArrowLeft}
          onClick={() => navigate("/profile")}
        >
          Back
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start gap-5">
              <Avatar
                src={photoPreview || user?.photo}
                name={user?.name}
                size="lg"
                className="ring-2 ring-(--bg-secondary) flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Tabs
                  tabs={photoTabs}
                  activeTab={photoTab}
                  onChange={setPhotoTab}
                />

                <div className="mt-3">
                  {photoTab === "upload" ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex items-center gap-2 px-3 py-2 bg-(--bg-secondary) border border-(--border-subtle) rounded-lg text-sm text-(--text-secondary) hover:border-(--border-default) hover:text-(--text-primary) transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="truncate">
                          {imageFile ? imageFile.name : "Choose file..."}
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/photo.jpg"
                        className="flex-1 px-3 py-2 bg-(--bg-secondary) border border-(--border-subtle) rounded-lg text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--accent-500) transition-colors"
                      />
                    </div>
                  )}
                  <p className="mt-1.5 text-xs text-(--text-muted)">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>

            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-(--accent-400)" />
              <h3 className="font-medium text-(--text-primary)">
                Connected Methods
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasLocalProvider && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-(--accent-500)/20 text-(--accent-400) border border-(--accent-500)/30">
                  <Key className="w-3 h-3" /> Password
                </span>
              )}
              {hasGoogleProvider && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#4285f4]/20 text-[#4285f4] border border-[#4285f4]/30">
                  <Globe className="w-3 h-3" /> Google
                </span>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-(--accent-400)" />
              <h3 className="font-medium text-(--text-primary)">
                Profile Details
              </h3>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Full Name"
                  value={name}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Input
                  name="phone"
                  label="Phone"
                  value={phone}
                  onChange={handleChange}
                  placeholder="Optional"
                  icon={Phone}
                />
              </div>

              <Input
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <div>
                <label className="block text-xs font-medium text-(--text-secondary) mb-1.5">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  maxLength={250}
                  rows={3}
                  className="w-full px-3 py-2 bg-(--bg-secondary) border border-(--border-subtle) rounded-lg text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--accent-500) transition-all resize-none"
                />
                <p className="mt-1 text-xs text-(--text-muted) text-right">
                  {bio.length}/250
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-(--accent-400)" />
              <h3 className="font-medium text-(--text-primary)">
                {hasLocalProvider ? "Change Password" : "Add Password"}
              </h3>
            </div>

            {!hasLocalProvider && hasGoogleProvider && (
              <div className="mb-4 p-3 bg-(--accent-500)/10 border border-(--accent-500)/30 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-(--accent-400) mt-0.5 flex-shrink-0" />
                <p className="text-xs text-(--text-secondary)">
                  Add a password to enable local login alongside Google.
                </p>
              </div>
            )}

            <div className="grid gap-4">
              {hasLocalProvider && (
                <Input
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={handleChange}
                  placeholder="Required to change"
                  icon={Lock}
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name="password"
                  type="password"
                  label={hasLocalProvider ? "New Password" : "Password"}
                  value={password}
                  onChange={handleChange}
                  placeholder={
                    hasLocalProvider
                      ? "Leave blank to keep"
                      : "Min 8 characters"
                  }
                  icon={Lock}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  label="Confirm"
                  value={confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  icon={Lock}
                />
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={Save} loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default EditProfilePage;
