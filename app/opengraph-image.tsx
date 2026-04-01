import { ImageResponse } from 'next/og';

export const alt = "Econoscope - L'economie, enfin visible";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#FAFBFC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              'linear-gradient(#5B5EF4 1px, transparent 1px), linear-gradient(90deg, #5B5EF4 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gradient orb */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(91,94,244,0.08), transparent)',
            top: 100,
            left: 100,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#5B5EF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            E
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#5B5EF4',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Econoscope
          </span>
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#1A1D26',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          L&apos;economie,
        </h1>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            background: 'linear-gradient(90deg, #5B5EF4, #22D3EE)',
            backgroundClip: 'text',
            color: 'transparent',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          enfin visible.
        </h1>

        <p
          style={{
            fontSize: 22,
            color: '#5F6980',
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          17 simulateurs interactifs &bull; 40 faits historiques &bull; 20
          economistes
        </p>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              'linear-gradient(90deg, #5B5EF4, #22D3EE, #10B981, #F59E0B, #EC4899)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
