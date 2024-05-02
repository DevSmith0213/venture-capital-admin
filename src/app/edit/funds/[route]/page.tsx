/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditFund from "@/components/Tables/EditFund";

interface IProps {
  params: {
    route: string;
  };
  searchParams: {};
}

const VentureCapitalFirms = ({ params }: IProps) => {
  return (
    <DefaultLayout>
      <Breadcrumb isVC={true} pageName={params.route} />
        <EditFund route={params.route}/>
    </DefaultLayout>
  );
};

export default VentureCapitalFirms;
