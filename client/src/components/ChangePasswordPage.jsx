function ChangePasswordPage({
  newPassword,
  setNewPassword,
  handleChangePassword
}) {
  return (
    <div className="card">
      <h2 className="section-title">Change Password</h2>

      <p>
        You are using a temporary password. Please create a new password before continuing.
      </p>

      <form onSubmit={handleChangePassword} className="form-stack">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="primary-brand-btn">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;