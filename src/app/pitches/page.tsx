"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from 'antd';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PitchesTable from "@/components/Tables/PitchesTable";

const PitchesPage = () => {
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
        const response = await axios.post("/api/getPitchesLists", { currentPage, perPage });
        setData(response.data);
      } catch (error) {
        setData([]);
      }
      setLoading(false);
    }
    fetch()
  }, [currentPage, perPage]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Pitches"} />
      <Spin tip="Loading..." spinning={loading}>
        <div className="flex flex-col gap-10">
          <PitchesTable
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

export default PitchesPage;
