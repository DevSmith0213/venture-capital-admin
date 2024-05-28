"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from 'antd';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import VCTable from "@/components/Tables/VCTable";
import { openNotificationWithIcon } from '@/utils/notification'

interface IProps {
  params: {
    route: string;
  };
  searchParams: {};
}

const VenturecapitalPage = ({ params }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getFundLists", { route: params.route, currentPage, perPage });
        setData(response.data);
      } catch (error) {
        setData([]);
        openNotificationWithIcon('error', "Fund", `Get fund data failed`)
      }
      setLoading(false);
    }
    fetch()
  }, [currentPage, params, perPage]);

  return (
    <DefaultLayout>
      <Breadcrumb isVC={true} pageName={params.route} />
      <Spin tip="Loading..." spinning={loading}>
        <div className="flex flex-col gap-10">
          <VCTable
            route={params.route}
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            perPage={perPage}
          />
        </div>
      </Spin>
    </DefaultLayout>
  );
};

export default VenturecapitalPage;
