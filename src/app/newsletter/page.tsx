"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from 'antd';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NewsLetterTable from "@/components/Tables/NewsLetterTable";
import { openNotificationWithIcon } from '@/utils/notification'

const VenturecapitalPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getNewsletterLists");
        setData(response.data);
      } catch (error) {
        setData([]);
        openNotificationWithIcon('error', "Country", `Get country data failed`)
      }
      setLoading(false);
    }
    fetch()
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Country"} />
      <Spin tip="Loading..." spinning={loading}>
        <div className="flex flex-col gap-10">
          <NewsLetterTable data={data} setLoading={setLoading}/>
        </div>
      </Spin>
    </DefaultLayout>
  );
};

export default VenturecapitalPage;
