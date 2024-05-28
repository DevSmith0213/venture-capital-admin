"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Input, Pagination, Tag } from 'antd';
import { ExclamationCircleOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import { uploadFileHandler } from '@/utils/firebaseQuery';
import Image from "next/image";
import { openNotificationWithIcon } from '@/utils/notification'
const { confirm } = Modal;

interface IProps {
  data: any[];
  setLoading: any;
}

const BannerTable = ({ data, setLoading }: IProps) => {
  const router = useRouter();
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [tData, setTData] = useState<any>(data);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

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
          const response = await axios.post("/api/changeBanner", { id, type });
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

  const handleCreateItem = async (type: string, id: any) => {
    const formData = new FormData();
    setOpen(false);
    setSelectedId(null);
    setLoading(true)
    try {
      if (imageFile) {
        var logo: any = await uploadFileHandler("countries", imageFile);
        formData.append('image', logo)
      } else {
        formData.append('image', image)
      }
      formData.append('desc', desc)
      formData.append('type', type)
      formData.append('id', id)

      const response: any = await fetch('/api/countryEdit', {
        method: 'post',
        body: formData,
      });

      if (!response.ok) {
        console.log("falling over")
        setLoading(false)
        openNotificationWithIcon('error', "Country", `Create failed`)
        throw new Error(`response status: ${response.status}`);
      }
      
      await response.json();
      setTimeout(() => {
        openNotificationWithIcon('error', "Country", `It has been create failed`)
        setImageFile(null);
        setLoading(false)
        setImage("")
        setDesc("")
        setSelectedId(null)
        router.refresh();
        window.location.reload();
      }, 500);

    } catch (error) {
      console.log(error);
      openNotificationWithIcon('error', "Country", `Create failed`)
      setLoading(false)
    }
  }

  const handlePageChange = (page: any, pageNumber: any) => {
    setCurrentPage(page);
  };

  const handleImageChange = (e: any) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Continent
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Country Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Country Image
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Country Description
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
                    {item.continent}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.title}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                  {item.image &&  item.image != undefined && item.image != "undefined" &&<Image
                    className="object-contain rounded-lg shadow-default"
                    src={item.image}
                    alt="Logo"
                    width={176}
                    height={32}
                  />}
                </td>
                <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.desc}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <Button onClick={() => { setSelectedId(item._id); setImage(item.image); setDesc(item.desc) }} className="flex items-center bg-[#1c2434] text-white"><EditOutlined /> Edit</Button>
                    <Modal
                      title="Updated Country"
                      centered
                      open={selectedId == item._id}
                      onCancel={() => { setSelectedId(null); setImage(""); setDesc("") }}
                      footer={(_: any, { OkBtn, CancelBtn }: any) => (
                        <>
                          <Button className="bg-[#1c2434] text-white" onClick={() => handleCreateItem("change", item._id)}>Save</Button>
                          <Button onClick={() => { setSelectedId(null); setImage(""); setDesc("") }}>Cancel</Button>
                        </>
                      )}
                    >
                      <Form layout="vertical">
                        <div className="flex flex-row">
                          <div className="block text-sm font-medium text-black dark:text-white flex flex-row w-1/2">
                            Name: <b>{item.title}</b>
                          </div>
                          <div className="block text-sm font-medium text-black dark:text-white flex flex-row w-1/2">
                            Continent: <b>{item.continent}</b>
                          </div>
                        </div>
                        <Form.Item
                          name="Image"
                          hasFeedback
                          label={<span className="text-black dark:text-white">Image</span>}
                        >
                          <input
                            id="Image" name="Image" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                            onChange={(e) => handleImageChange(e)}
                            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                          />
                        </Form.Item>
                        <Form.Item
                          name="desc"
                          hasFeedback
                          label={<span className="text-black dark:text-white">Country Description</span>}
                          rules={[{ required: true }, { type: 'string' }]}
                        >
                          <Input.TextArea value={desc} defaultValue={item.desc} onChange={(event: any) => setDesc(event.target.value)} placeholder="Please input Title" />
                        </Form.Item>
                      </Form>
                    </Modal>
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

export default BannerTable;
