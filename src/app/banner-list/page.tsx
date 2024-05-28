"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from 'antd';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BannerTable from "@/components/Tables/BannerTable";
import { openNotificationWithIcon } from '@/utils/notification'

const VenturecapitalPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getBannerLists");
        setData(response.data);
      } catch (error) {
        setData([]);
        openNotificationWithIcon('error', "Banner", `Get Data failed`)
      }
      setLoading(false);
    }
    fetch()
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Banner"} />
      <Spin tip="Loading..." spinning={loading}>
        <div className="flex flex-col gap-10">
          <BannerTable data={data} setLoading={setLoading}/>
        </div>
      </Spin>
    </DefaultLayout>
  );
};

export default VenturecapitalPage;
