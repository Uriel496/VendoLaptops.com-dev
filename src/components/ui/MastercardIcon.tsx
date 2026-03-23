interface IconProps {
  size?: number;
  color?: string;
  background?: string;
  opacity?: number;
  rotation?: number;
  shadow?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  padding?: number;
}

const MastercardIcon = ({
  size,
  color = '#000000',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: IconProps) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = 24 + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill={color}
      stroke="none"
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path d="M11.343 18.031q.088.074.181.146a7.4 7.4 0 0 1-4.107 1.238a7.416 7.416 0 1 1 4.104-13.593c-.06.051-.12.098-.165.15A7.96 7.96 0 0 0 8.595 12a8 8 0 0 0 2.748 6.031m5.241-13.447c-1.52 0-2.931.456-4.105 1.238c.06.051.12.098.165.15A7.96 7.96 0 0 1 15.405 12a8 8 0 0 1-2.748 6.031q-.088.074-.181.146a7.4 7.4 0 0 0 4.107 1.238A7.414 7.414 0 0 0 24 12a7.417 7.417 0 0 0-7.416-7.416M12 6.174q-.144.111-.28.231A7.4 7.4 0 0 0 9.169 12A7.39 7.39 0 0 0 12 17.827q.144-.112.28-.232A7.4 7.4 0 0 0 14.831 12A7.39 7.39 0 0 0 12 6.174"/>
    </svg>
  );
};

export default MastercardIcon;
