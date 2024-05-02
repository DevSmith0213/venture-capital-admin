"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from 'antd';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CTTable from "@/components/Blog/CTTable";
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(() => import('@/components/Blog/CreateBlog'), {
  ssr: false
});

interface IProps {
  params: {
    route: string;
  };
  searchParams: {};
}

const BlogPage = ({ params }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getBlogLists", { route: params.route, currentPage, perPage });
        window.scrollTo(0, 0);
        setData(response.data);
      } catch (error) {
        setData([]);
      }
      setLoading(false);
    }

    if (params.route !== "create" && !params.route.includes("edit")) {
      fetch()
    }

  }, [currentPage, params]);

  return (
    <DefaultLayout>
      {params.route == "create" || params.route.includes("edit") ?
        <>
          <Breadcrumb pageName="Blogs" />
          <div className="flex flex-col gap-10">
            <DynamicComponentWithNoSSR route={params.route} />
          </div>
        </>
        :
        <>
          <Breadcrumb isBlog={true} pageName={params.route} />
          <Spin tip="Loading..." spinning={loading}>
            <div className="flex flex-col gap-10">
              <CTTable
                route={params.route}
                data={data}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                perPage={perPage}
              />
            </div>
          </Spin>
        </>
      }

    </DefaultLayout>
  );
};

export default BlogPage;
