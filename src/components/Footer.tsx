const Footer = () => {
  return (
    <footer className="py-4 border-t">
      <div className="container text-center text-sm text-muted-foreground">
        Built for Supabase LW13 Hackathon by{" "}
        <a
          href="https://github.com/asrvd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          ashish
        </a>{" "}
        &{" "}
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          lovable
        </a>
      </div>
    </footer>
  );
};

export default Footer;