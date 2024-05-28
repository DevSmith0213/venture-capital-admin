"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from 'antd';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BlogTable from "@/components/Blog/BlogTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { openNotificationWithIcon } from '@/utils/notification'

const BlogsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getBlogLists", { route: "blog", currentPage, perPage });
        window.scrollTo(0, 0);
        setData(response.data);
      } catch (error) {
        setData([]);
        openNotificationWithIcon('error', "Blog", `Get blog data failed`)
      }
      setLoading(false);
    }
    fetch()
  }, [currentPage]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Blogs" />

      <Spin tip="Loading..." spinning={loading}>
        <div className="flex flex-col gap-10">
          <BlogTable
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            perPage={perPage} />
        </div>
      </Spin>
    </DefaultLayout>
  );
};

export default BlogsPage;
