"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Pagination } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import { openNotificationWithIcon } from '@/utils/notification'
const { confirm } = Modal;

interface IProps {
  data: any[];
  setLoading: any;
}

const NewsLetterTable = ({ data, setLoading }: IProps) => {
  const router = useRouter();
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [tData, setTData] = useState<any>(data);

  useEffect(() => {
    if (data) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setTData(data.slice(startIndex, endIndex));
    }
  }, [currentPage, data]);

  const handleItem = async (id: any, type: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>Are you really {type} this?</p>,
      okButtonProps: { type: 'default' },
      async onOk() {
        try {
          setLoading(true)
          const response = await axios.post("/api/changeNewsletter", { id, type });
          setLoading(false)
          openNotificationWithIcon('success', "User", `It has been successfully ${type}d.`)
          router.refresh();
          window.location.reload();
        } catch (error) {
          console.log(error);
          openNotificationWithIcon('error', "User", `It has been ${type} failed`)
          setLoading(false)
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }

  const handlePageChange = (page: any, pageNumber: any) => {
    setCurrentPage(page);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tData?.map((item: any) => (
              <tr key={item._id}>
                <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.email}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${item.isActive
                      ? "bg-success text-success"
                      : "bg-danger text-danger"
                      }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${item.isActive
                      ? "bg-danger text-danger" : "bg-success text-success"}`} onClick={() => handleItem(item._id, "change")}>
                      {item.isActive ? "Disable" : "Enable"}
                    </button>
                    <button className="hover:text-primary" onClick={() => handleItem(item._id, "remove")}>
                      <DeleteOutlined />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          className="py-4 text-center"
          total={data.length}
          pageSize={ITEMS_PER_PAGE}
          current={currentPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default NewsLetterTable;
