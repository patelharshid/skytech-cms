import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { TopMarqueeListView } from 'src/sections/top-marquee/view';

const metadata = { title: `Top Marquee | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <TopMarqueeListView />
    </>
  );
}
