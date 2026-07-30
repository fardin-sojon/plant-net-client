import { FaUserCog, FaEnvelope, FaTicketAlt, FaCommentAlt, FaFolder, FaTag, FaFileAlt, FaImages, FaHistory } from 'react-icons/fa'
import MenuItem from './MenuItem'

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUserCog} label='Manage Users' address='manage-users' />
      <MenuItem icon={FaEnvelope} label='Manage Messages' address='manage-messages' />
      <MenuItem icon={FaFolder} label='Categories' address='categories' />
      <MenuItem icon={FaTag} label='Brands' address='brands' />
      <MenuItem icon={FaTicketAlt} label='Manage Coupons' address='manage-coupons' />
      <MenuItem icon={FaCommentAlt} label='Manage Reviews' address='manage-reviews' />
      <MenuItem icon={FaFileAlt} label='Reports' address='reports' />
      <MenuItem icon={FaImages} label='Media Library' address='media-library' />
      <MenuItem icon={FaHistory} label='Activity Logs' address='activity-logs' />
    </>
  )
}

export default AdminMenu
