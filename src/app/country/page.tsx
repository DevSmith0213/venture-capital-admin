"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from 'antd';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CountryTable from "@/components/Tables/CountryTable";

const VenturecapitalPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getCountryLists");
        setData(response.data);
      } catch (error) {
        setData([]);
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
          <CountryTable data={data} setLoading={setLoading}/>
        </div>
      </Spin>
    </DefaultLayout>
  );
};

export default VenturecapitalPage;
