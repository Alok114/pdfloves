'use client';

export function AdBanner() {
  return (
    <div className="flex justify-center items-center py-6">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4919055494097878"
        data-ad-slot=""
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
