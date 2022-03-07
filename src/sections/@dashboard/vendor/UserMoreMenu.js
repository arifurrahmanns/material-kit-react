import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Backdrop, CircularProgress } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import axios from '../../../axios/axiosinstance'
// ----------------------------------------------------------------------

export default function UserMoreMenu({ id, updated }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [backdrop, setBackdrop] = useState(false)



  const deleteHandler = (id) => {

    window.confirm("Are you sure to delete?")
    const body = { id: [id] }
    setBackdrop(true)
    axios.delete("/admin/vendor/delete", {
      params: {
        ...body
      }
    }).then((response) => {
      if (response.data) {
        setIsOpen(false)
        updated(id)
        setBackdrop(false)
      }
    })
  }

  const ditHandler = () => {
    console.log(id)
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { deleteHandler(id) }} sx={{ color: 'text.secondary' }}>
          <ListItemIcon >
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={() => { ditHandler(id) }} component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon >
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
