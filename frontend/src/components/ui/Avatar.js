import React, { memo } from 'react';
import { getAvatarGradient } from '../../constants';

/**
 * Avatar — shows user initials in a coloured circle.
 * Colour is deterministic based on the name so it never flickers.
 */
const Avatar = memo(({ name = '', size = 32, fontSize, style = {} }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  const gradient = getAvatarGradient(name);
  const fs = fontSize || Math.round(size * 0.34);

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: fs,
      userSelect: 'none',
      ...style,
    }}>
      {initials}
    </div>
  );
});

Avatar.displayName = 'Avatar';
export default Avatar;
