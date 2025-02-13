import reducer from './store'
import { injectReducer } from '@/store'
import {  useEffect, useState, useRef } from 'react'
import type { CampaignRewardTrackingData } from '@/@types/CampaignRewardTracking'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { MdClose } from 'react-icons/md';
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useAppSelector,
  postCampaignResolve,
  postMessage,
  postCampaignResolveRequest,
  getMessageDetails,
  GetChatMessageResponse,
} from './store'
import {
  useAppSelector as useAppSelectorTable, 
} from '../CampaignRewardTracking/store'
import { object } from 'yup'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any

injectReducer('TrackingDetails', reducer)

const CampaignRewardTrackingDetailsPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGiftOpen, setIsGiftOpen] = useState(false);
    const [rewardAmount, setRewardAmount] = useState("");
    const [messageTyped, setMessageTyped] = useState('')
    const [isSubmitting,setSubmitting] = useState(false)
    const [requestDetails,setrequestDetails] = useState<CampaignRewardTrackingData>()
    const tableData = useAppSelectorTable((state)=>state.rewardTracking.data.TrackingList)
    const chatDetails = useAppSelector((state)=>state.TrackingDetails.data.message)
    const [alteredChat, setAlteredChat] = useState([])
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const handleDiscard = ()=> {
      navigate('/rewardTracking')
    }

    function findObjectById(Id: String, array: CampaignRewardTrackingData[]): CampaignRewardTrackingData | undefined {
      return array.find(item => item.Id === Id);
    }

    const handlePostMessage = async (message:String, Id?:String) => {
      if(message.trim() == '') return
      try {
        dispatch(postMessage({"ticket_id": Number(Id), "msg":message, "type": 2}))
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally{
        setMessageTyped('')
        setTimeout(()=>{
          dispatch(getMessageDetails({ticket_id: Number(Id), type: 2}))
        },500)

      }
    }
    

    const handleClose = async (
      values: postCampaignResolveRequest,
      setSubmitting: any
    ) => {
      setSubmitting(true);
      
      try {
        const resultAction = await dispatch(postCampaignResolve(values));
        if (postCampaignResolve.fulfilled.match(resultAction)) {
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
      const keywords = ["http://", "https://", "www.", ".com", ".net", ".org"];
      return keywords.some(keyword => text.includes(keyword));
    }

    function generateMessage(data:CampaignRewardTrackingData) {
      console.log(data)
      // Create a message based on the data object
      const message = `Hello, ${data.user_name} here! I would like to request the initiation of my participation reward of ₹${data.reward_amt} for the store "${data.store}". Thank you!`;
    
      return[
        {
          actor: 2,
          msg: message,
          created_at: data.created_at,
        },
        ...(data.notes ? [{
          actor: 2, 
          msg: data.notes,
          created_at: data.created_at,
        }] : []),
      ];
    }

    useEffect(() => {
      const Id = location.pathname.substring(
          location.pathname.lastIndexOf('/')+1,
      )
      const data = findObjectById(Id ,tableData)
      dispatch(getMessageDetails({ticket_id: Number(data?.Id), type: 2}))
      setrequestDetails(data)
  }, [location.pathname])

  useEffect(() => {
    if (!requestDetails) return;
    const chat = generateMessage(requestDetails);
    const alteredChat = [...chat,...chatDetails];
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
            <div className="flex flex-col justify-evenly items-center  p-4 max-h-80">
              <FaUser size={100} className="text-gray-500 mb-4" />
              <hr className="w-[30%] border-gray-300 mb-4" />
              <h1 className="text-xl font-semibold text-gray-800">{requestDetails?.user_name}</h1>
              <p className="text-gray-600 flex gap-2 my-1">{requestDetails?.id_user}</p>
              <p className="text-gray-600 flex gap-2 my-1"><FaPhone size={16} />{requestDetails?.user_phone}</p>
              <hr className="w-full border-gray-300 mt-4" />
            </div>

            <div className="flex flex-col justify-between p-4 space-y-4 ">
              <h1 className="text-2xl font-bold text-gray-900">{requestDetails?.store}</h1>
              <h2 className="text-lg font-medium text-gray-700">{requestDetails?.retailer}</h2>
              <p className="text-lg font-semibold ">Reward Amount: <span className='text-green-600'>₹ {requestDetails?.reward_amt}</span></p>
              <hr/>
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
              <div className="w-full mx-auto  bg-white shadow-sm rounded-lg">
                <button
                  className="text-base w-full flex justify-between items-center p-3 text-left font-normal  rounded-lg focus:outline-none"
                  onClick={() => setIsGiftOpen(!isGiftOpen)}
                >
                  <span>Gift Card</span>
                  <span>{isGiftOpen ? "▲" : "▼"}</span>
                </button>
                <div
                  className={`overflow-hidden transition-max-height duration-500 ease-in-out flex flex-col ${
                    isGiftOpen ? "max-h-96 p-4" : "max-h-0 p-0"
                  }`}
                >
                  <input
                    id="rewardAmount"
                    type="text"
                    value={''}
                    onChange={(e) => null}
                    placeholder="Brand Name"
                    className="w-full border rounded-lg p-2 my-2 text-gray-700 focus:outline-none focus:ring focus:ring-gray-200"
                  />
                  <input
                    id="rewardAmount"
                    type="text"
                    value={''}
                    onChange={(e) => null}
                    placeholder="Brand Key"
                    className="w-full border rounded-lg p-2 my-2 text-gray-700 focus:outline-none focus:ring focus:ring-gray-200"
                  />
                  <input
                    id="rewardAmount"
                    type="text"
                    value={''}
                    onChange={(e) => null}
                    placeholder="Brand URL"
                    className="w-full border rounded-lg p-2 my-2 text-gray-700 focus:outline-none focus:ring focus:ring-gray-200"
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
              <div key={chat.created_at} className={`mb-4 ${chat.actor === 1 ? "text-right " : "text-left"}`}>
                <p className="text-sm font-semibold">{chat.actor==1 ? 'Cheggout' : requestDetails?.user_name}</p>
                <div className={`chatBox relative inline-block p-2 rounded-lg ${chat.actor === 1 ? "bg-blue-100 chatBox_admin" : "bg-gray-200 chatBox_customer"}`}>
                  {!isProbableUrl(chat.msg) ? 
                      <p>{chat.msg}</p>
                    :
                      <img src={chat.msg} alt="Chat Attachment" className="mt-2 max-w-xs rounded" />
                  }
                </div>
                <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleString()}</p>
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
