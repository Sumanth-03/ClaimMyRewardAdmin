import reducer from './store'
import { injectReducer } from '@/store'
import {  useEffect, useState, useRef } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import StickyFooter from '@/components/shared/StickyFooter'
import { Form, Formik, FormikProps } from 'formik'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { MdClose } from 'react-icons/md';
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'
import Dropdown from '@/components/ui/Dropdown/Dropdown'
import {
  useAppDispatch,
  useAppSelector,
  postMerchantResolve,
  postMerchantResolveRequest,
  getMessageDetails,
} from './store'
import {
  useAppDispatch as useAppDispatchTable, 
  useAppSelector as useAppSelectorTable, 
} from '../MerchantRewardTracking/store'

import {
  postMessage,
} from '../CampaignRewardTrackingDetailsPage/store/campaignDetailSlice'

import { MerchantRewardTrackingData } from '@/@types/MerchantRewardTracking'

injectReducer('merchantRewardTrackingDetails', reducer)

const CampaignRewardTrackingDetailsPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rewardAmount, setRewardAmount] = useState("");
    const [messageTyped, setMessageTyped] = useState('')
    const [isSubmitting,setSubmitting] = useState(false)
    const [requestDetails,setrequestDetails] = useState<MerchantRewardTrackingData>()
    const tableData = useAppSelectorTable((state)=>state.merchantRewardTracking.data.TrackingList)
    const chatDetails = useAppSelector((state)=>state.merchantRewardTrackingDetails.data.message)
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const [alteredChat, setAlteredChat] = useState([])

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleDiscard = ()=> {
      navigate('/rewardTracking')
    }


    function findObjectById(Id: String, array: MerchantRewardTrackingData[]): MerchantRewardTrackingData | undefined {
          return array.find(item => item.Id === Id);
        }
    
      const handlePostMessage = async (message:String, Id?:String) => {
        if(message.trim() == '') return
        try {
          dispatch(postMessage({"ticket_id": Number(Id), "msg":message, "type": 1}))
        } catch (error) {
          console.error("Error fetching chat:", error);
        } finally{
          setMessageTyped('')
          setTimeout(()=>{
            dispatch(getMessageDetails({ticket_id: Number(Id), type: 1}))
          },500)
  
        }
      }
      
  
      const handleClose = async (
        values: postMerchantResolveRequest,
        setSubmitting: any
      ) => {
        setSubmitting(true);
        
        try {
          const resultAction = await dispatch(postMerchantResolve(values));
          if (postMerchantResolve.fulfilled.match(resultAction)) {
            navigate("/rewardTracking");
          } else {
            console.error("API Request Failed:", resultAction.error);
          }
        } catch (error) {
          console.error("Unexpected Error:", error);
        } finally {
          setSubmitting(false);
        }
      };
  
      function isProbableUrl(text:String) {
        const keywords = ["http://", "https://"];
        return keywords.some(keyword => text.includes(keyword));
      }
  
      useEffect(() => {
        const Id = location.pathname.substring(
            location.pathname.lastIndexOf('/')+1,
        )
        const data = findObjectById(Id ,tableData)
        dispatch(getMessageDetails({ticket_id: Number(data?.Id), type: 1}))
        setrequestDetails(data)
    }, [location.pathname])

    function generateMessage(data:MerchantRewardTrackingData) {
      console.log(data)
      // Create a message based on the data object
      const message = `Hello, ${data.user_name} here! I’d like to request my purchase reward of ₹${data.reward_amt} for order ID ${data.order_id}, purchased on ${new Date(data.purchase_date).toLocaleDateString()}. Please process it at the earliest. Thank you!`
    
      return {
        actor: 2,
        msg: message,
        created_at: data.created_at,
      }
    }
  
    useEffect(() => {
      if (!requestDetails) return;
      const chat = generateMessage(requestDetails);
      const alteredChat = [chat,...chatDetails];
      setAlteredChat(alteredChat)
    }, [chatDetails]);
  
    useEffect(()=>{
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    },[alteredChat])

    return  (
      <main className='flex flex-col'>
        <section className="flex flex-col md:flex-row w-full bg-white shadow-lg rounded-lg p-6 mb-6 0 min-h-[500px]">
          <div className=' w-full md:w-[40%] '>
          <div className="flex flex-col justify-evenly items-center border-r border-gray-200 p-4 max-h-80">
            <FaUser size={100} className="text-gray-500 mb-4" />
            <hr className="w-full border-gray-300 mb-4" />
            <h1 className="text-xl font-semibold text-gray-800">{requestDetails?.user_name}</h1>
            <p className="text-gray-600 flex gap-2 my-1">{requestDetails?.id_user}</p>
            <p className="text-gray-600 flex gap-2 my-1"><FaPhone size={16} />{requestDetails?.user_phone}</p>
            <p className="text-gray-600 flex gap-2 items-center"><IoMail size={16}/> {requestDetails?.user_email}</p>
          </div>
          <div className="flex flex-col justify-between p-4 space-y-4 ">
            <h1 className="text-2xl font-bold text-gray-900">{requestDetails?.retailer}</h1>
            <h2 className="text-lg font-medium text-gray-700">Order Id: {requestDetails?.order_id}</h2>
            <p className="text-gray-600 text-justify">Order Amount: {requestDetails?.order_amt}</p>
            <p className="text-lg font-semibold ">Reward Amount: <span className='text-green-600'>₹ {requestDetails?.reward_amt}</span></p>
              <aside className='flex flex-col bg-white shadow-md rounded-lg mt-5 p-2 '>
              <h2 className='text-lg w-full font-medium text-center p-2'>Reward Configuration</h2>
              <div className="w-full mx-auto  bg-white shadow-sm rounded-lg">
                <button
                  className="text-base w-full flex justify-between items-center p-3 text-left font-normal  rounded-lg focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>Reward points</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>
                <div
                  className={`overflow-hidden transition-max-height duration-500 ease-in-out flex flex-col ${
                    isOpen ? "max-h-96 p-4" : "max-h-0 p-0"
                  }`}
                >
                  <input
                    id="rewardAmount"
                    type="text"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    placeholder="Enter new reward points"
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring focus:ring-gray-200"
                  />
                  <button
                    className="mt-4 w-fit px-5 bg-primary ml-auto text-white py-2 rounded-lg hover:bg-primary"
                  >
                    Process Now
                  </button>
                </div>
              </div>
              </aside>
              
            </div>
          </div>
          {/* chat box */}
        <section className='w-full md:w-[60%] max-h-fit rounded-xl mx-auto  bg-white shadow-md'>
          <div className="flex items-center p-4 border-b bg-primary text-white gap-2 mb-4">
            <FaRegUserCircle size={30} />
            <div>
              <p className="text-lg font-semibold">{requestDetails?.user_name}</p>
              <p className="text-sm">Support Chat</p>
            </div>
          </div>
          <div ref={chatBoxRef} className="h-96 overflow-y-auto px-10 scrollbar-thin scrollbar-thumb-gray-600">
          {alteredChat?.map((chat) => (
              <div key={chat?.created_at} className={`mb-4 ${chat?.actor === 1 ? "text-right " : "text-left"}`}>
                <p className="text-sm font-semibold">{chat.actor==1 ? 'Cheggout' : requestDetails?.user_name}</p>
                <div className={`chatBox relative inline-block p-2 rounded-lg ${chat?.actor === 1 ? "bg-blue-100 chatBox_admin" : "bg-gray-200 chatBox_customer"}`}>
                  {!isProbableUrl(chat?.msg) ? 
                      <p>{chat?.msg}</p>
                    :
                      <img src={chat?.msg} alt="Chat Attachment" className="mt-2 max-w-xs rounded" />
                  }
                </div>
                <p className="text-xs text-gray-500">{new Date(chat?.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center p-3 border-t bg-gray-100">
            <input
              type="text"
              placeholder="Enter your message here"
              value={messageTyped}
              onChange={(e)=>setMessageTyped(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
            />
            <Button
                  size="sm"
                  variant="solid"
                  onClick={()=>handlePostMessage(messageTyped,requestDetails?.Id)}
                  type="submit"
                  className='ml-2'
              >
                   Reply
            </Button>
          </div>
        </section>
      </section>
          <StickyFooter
              className="-mx-8 px-8 flex items-center justify-end py-4 z-10 gap-2"
              stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
              <Button
                  size="sm"
                  variant="solid"
                  onClick={handleDiscard}
                  type="submit"
              >
                  Discard
              </Button>
              <Button
                  size="sm"
                  variant="solid"
                  color='red'
                  loading={isSubmitting}
                  icon={<MdClose/>}
                  onClick={() => handleClose({id:requestDetails?.Id, report_status:'resolved'},setSubmitting)}
                  type="submit"
              >
                  Close Ticket
              </Button>
          </StickyFooter>
      </main>
      );
}

CampaignRewardTrackingDetailsPage.displayName = 'RewardTrackingDetails';

export default CampaignRewardTrackingDetailsPage
