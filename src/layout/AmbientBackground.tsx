/** Cahaya ambient biru dan ungu yang bergerak pelan di belakang seluruh aplikasi. */
export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />
      <span className="blob blob-4" />
      <span className="blob blob-5" />
    </div>
  );
}
