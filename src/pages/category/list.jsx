import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { CategoryListView } from 'src/sections/category/view';

const metadata = { title: `Categories | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <CategoryListView />
    </>
  );
}
