"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button, Modal, Input, Pagination, Tag } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import { openNotificationWithIcon } from '@/utils/notification'
const { confirm } = Modal;

interface IProps {
  route: string;
  data: { infos: [], dataLength: number };
  perPage: any,
  currentPage: any,
  setCurrentPage: any
}

const VCTable = ({ route, data, perPage, currentPage, setCurrentPage }: IProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleItem = async (id: any, type: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>Are you really {type} this?</p>,
      okButtonProps: { type: 'default' },
      async onOk() {
        try {
          const response = await axios.post("/api/changeFilter", { route, id, type });
          openNotificationWithIcon('success', "Fund Data", `It has been successfully ${type}d.`)
          router.refresh();
          window.location.reload();
        } catch (error) {
          openNotificationWithIcon('error', "Fund Data", `It has been ${type} failed`)
          console.log(error);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }

  const handleCreateItem = async () => {
    try {
      const response = await axios.post("/api/createFilter", { route, title });
      openNotificationWithIcon('success', "Fund Data", `It has been successfully created.`)
      
      setOpen(false);
    } catch (error) {
      openNotificationWithIcon('error', "Fund Data", `It has been create failed`)
      console.log(error);
    }
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
          {route !== "vc" && route !== "new-vc" && <>
            <Button danger onClick={() => setOpen(true)} className="flex items-center">
              <PlusOutlined />Create New
            </Button>
            <Modal
              title="Create New"
              centered
              open={open}
              onCancel={() => setOpen(false)}
              footer={(_: any, { OkBtn, CancelBtn }: any) => (
                <>
                  <Button className="bg-[#1c2434] text-white" onClick={() => handleCreateItem()} disabled={title == ""}>Create</Button>
                </>
              )}
            >
              <Input value={title} onChange={(event: any) => setTitle(event.target.value)} placeholder="Please input Title" />
            </Modal>
          </>}
        </div>
        {route == "vc" || route == "new-vc" ?
          <table className="w-full table-auto mt-4">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Logo
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Title
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Websites
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Investment Area
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Investment Stage
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Location
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
                    <h5 className="font-medium text-black dark:text-white">
                      {item.title}
                    </h5>
                  </td>
                  <td >
                    {item?.websites?.map((site: any, index: any) => (
                      <a href={site} target="_blank" key={index} className="mb-2 text-sm text-[#549dd2]">
                        <Tag color="blue" className="mb-1">{site}</Tag>
                      </a>
                    ))}
                  </td>
                  <td >
                    {item.areas?.map((area: any) => (
                      <Tag key={area._id} color="orange" className="mb-1">{area?.title}</Tag>
                    ))}
                  </td>
                  <td >
                    {item.stages?.map((stage: any) => (
                      <Tag key={stage._id} color="geekblue" className="mb-1">{stage?.title}</Tag>
                    ))}
                  </td>
                  <td >
                    {item.location}
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
                      <Link className="hover:text-primary" href={`/edit/${item.route}`}>
                        <EditOutlined />
                      </Link>
                      <button className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${item.isActive
                        ? "bg-danger text-danger" : "bg-success text-success"}`} onClick={() => handleItem(item._id, "change")}>
                        {item.isActive ? "Disable" : "Enable"}
                      </button>
                      <button className="hover:text-primary" onClick={() => handleItem(item._id, "remove")}>
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          :
          <table className="w-full table-auto mt-4">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Title
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
                <tr key={item._id}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {item.title}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
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
                      <Link className="hover:text-primary" href={`/${route}/edit_${item._id}`}>
                        <EditOutlined />
                      </Link>
                      <button className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${item.isActive
                        ? "bg-danger text-danger" : "bg-success text-success"}`} onClick={() => handleItem(item._id, "change")}>
                        {item.isActive ? "Disable" : "Enable"}
                      </button>
                      <button className="hover:text-primary" onClick={() => handleItem(item._id, "remove")}>
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }

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

export default VCTable;
