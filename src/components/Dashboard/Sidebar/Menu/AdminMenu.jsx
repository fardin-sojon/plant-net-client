import { FaUserCog, FaEnvelope, FaTicketAlt } from 'react-icons/fa'
import MenuItem from './MenuItem'

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUserCog} label='Manage Users' address='manage-users' />
      <MenuItem icon={FaEnvelope} label='Manage Messages' address='manage-messages' />
      <MenuItem icon={FaTicketAlt} label='Manage Coupons' address='manage-coupons' />
    </>
  )
}

export default AdminMenu
