import logoSvg from "/logo.svg?raw";

interface LogoProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

// Inline the trusted brand asset so its wordmark inherits the surrounding color.
const logoContents = logoSvg.replace(/^<svg[^>]*>|<\/svg>\s*$/g, "");

export function Logo({ className = "h-8 w-auto", width, height }: LogoProps) {
  return (
    <svg
      viewBox="0 0 7038 2112"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Attraccess"
      dangerouslySetInnerHTML={{ __html: logoContents }}
    />
  );
}
