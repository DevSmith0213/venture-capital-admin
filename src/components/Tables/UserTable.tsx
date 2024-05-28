"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Modal, Input, Pagination, Tag } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import { openNotificationWithIcon } from '@/utils/notification'
const { confirm } = Modal;

interface IProps {
  data: { infos: [], dataLength: number };
  perPage: any,
  currentPage: any,
  setCurrentPage: any
}

const UserTable = ({ data, perPage, currentPage, setCurrentPage }: IProps) => {
  const router = useRouter();

  const handleItem = async (id: any, type: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>Are you really {type} this?</p>,
      okButtonProps: { type: 'default' },
      async onOk() {
        try {
          await axios.post("/api/changeUser", { id, type });
          openNotificationWithIcon('success', "User", `It has been successfully ${type}d.`)
          router.refresh();
          window.location.reload();
        } catch (error) {
          openNotificationWithIcon('error', "User", `It has been ${type} failed`)
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
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Linkedin
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Role
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
                <td>
                  <h5 className="font-medium text-black dark:text-white">{item.name}</h5>
                </td>
                <td>
                  <h5 className="font-medium text-black dark:text-white">{item.email}</h5>
                </td>
                <td>
                  <h5 className="font-medium text-black dark:text-white">{item.linkedin}</h5>
                </td>
                <td>
                  <Tag color="orange" className="mb-1">{item.role}</Tag>
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
                    <button className="hover:text-primary" onClick={() => handleItem(item._id, "edit")}>
                      <EditOutlined />
                    </button>
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

export default UserTable;
