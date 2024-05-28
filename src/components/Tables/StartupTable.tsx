"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button, Modal, Input, Pagination, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import { openNotificationWithIcon } from '@/utils/notification'
const { confirm } = Modal;

interface IProps {
  data: { infos: [], dataLength: number };
  perPage: any,
  currentPage: any,
  setCurrentPage: any
}

const StartupTable = ({ data, perPage, currentPage, setCurrentPage }: IProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleItem = async (item: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>Are you really {item.isActive ? "disable" : "enable"} this?</p>,
      okButtonProps: { type: 'default' },
      async onOk() {
        try {
          const response = await axios.post("/api/changeStartup", { id: item._id });
          openNotificationWithIcon('success', "Startup", `It has been successfully updated.`)
          router.refresh();
          window.location.reload();
        } catch (error) {
          console.log(error);
          openNotificationWithIcon('error', "Startup", `It has been update failed`)
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
        <div className="w-full flex justify-between">
          <div className="flex items-center text-black dark:text-white">
            Totoal items: {data.dataLength}
          </div>
        </div>
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                User
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Logo
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Title
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Website
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Investment Area
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Investment Stage
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Pitch Deck URL
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.infos?.map((item: any) => (
              <tr key={item._id} className="border-b border-[#eee] px-4 py-4 dark:border-strokedark h-[60px]" >
                <td >
                  <h5 className="font-medium text-sm text-black dark:text-white">{item.user.name}</h5>
                  <h5 className="font-medium text-sm text-black dark:text-white">{item.user.email}</h5>
                </td>
                <td >
                  {item.logo &&
                    <Image className="object-contain rounded-lg shadow-default"
                      src={item.logo}
                      alt="Logo"
                      width={60}
                      height={60}
                    />
                  }
                </td>
                <td>
                  <h5 className="font-medium text-black dark:text-white">{item.name}</h5>
                </td>
                <td>
                  <a href={item.website} target="_blank" className="mb-2 text-sm">
                    <Tag color="purple" className="mb-1">{item.website}</Tag>
                  </a>
                </td>
                <td >
                  {item.areasList?.map((area: any) => (
                    <Tag key={area._id} color="orange" className="mb-1">{area?.title}</Tag>
                  ))}
                </td>
                <td >
                  {item.stageList?.map((stage: any) => (
                    <Tag key={stage._id} color="geekblue" className="mb-1">{stage?.title}</Tag>
                  ))}
                </td>
                <td >
                  <a href={item.deckURL} target="_blank" className="mb-2 text-sm">
                    <Tag color="volcano" className="mb-1">{item.deckURL}</Tag>
                  </a>
                </td>
                <td>
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${item.isActive
                      ? "bg-success text-success" : "bg-danger text-danger"}`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </p>
                </td>
                <td>
                  <div className="flex items-center space-x-3.5">
                    <button className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${item.isActive
                      ? "bg-danger text-danger" : "bg-success text-success"}`} onClick={() => handleItem(item)}>
                      {item.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          className="py-4 text-center"
          total={data.dataLength}
          pageSize={perPage}
          current={currentPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default StartupTable;
