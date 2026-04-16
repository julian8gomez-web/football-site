function LoginPage({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin
}) {
  return (
    <div className="card">
      <h2 className="section-title">Login</h2>

      <form onSubmit={handleLogin} className="form-stack">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="primary-brand-btn">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;