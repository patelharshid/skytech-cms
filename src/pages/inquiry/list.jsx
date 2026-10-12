import { Helmet } from 'react-helmet-async';
import { InquiryListView } from 'src/sections/inquiry/view';

export default function InquiryListPage() {
  return (
    <>
      <Helmet>
        <title>Inquiries | SkyTech CMS</title>
      </Helmet>
      <InquiryListView />
    </>
  );
}
