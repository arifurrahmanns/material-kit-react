import { filter, random } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from '../../axios/axiosinstance'
import { Link as RouterLink, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Backdrop,
  IconButton
} from '@mui/material';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user';

import getFilename from '../../helpers/getfileName';
import { Identity } from '@mui/base';
import Newvendor from '../../sections/vendor/Newvendor';



//


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'loginmethod', label: 'Login Method', alignRight: false },


  { id: 'status', label: 'Status', alignRight: false },

  { id: uuid() },
  { id: uuid() }

];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}



export default function Users() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0)
  const [USERLIST, setUSERLIST] = useState(null);
  const [oldUserList, setOldUserList] = useState(null)
  const [updatedList, setUpdatedList] = useState([]);
  const [backdrop, setBackdrop] = useState(false)
  const [addNew, setAddNew] = useState(false)
  useEffect(() => {
    axios.get("admin/users?page=" + (page + 1)).then((response) => {
      if (response.data.success) {
        if (USERLIST !== null) {
          const userList = [...USERLIST]

          let newList = response.data.success.data

          function add(arr, id, obj) {
            const { length } = arr;

            const found = arr.some(el => el.id === id);
            if (!found) arr.push(obj);
            return arr;
          }
          let newArr = []
          newList.forEach((obj) => {
            newArr = [...add(userList, obj.id, obj)];
          })

          setUSERLIST(newArr)
        } else {
          setUSERLIST(response.data.success.data)
        }
        setOldUserList({ user: response.data.success.data, totalpage: response.data.success.total, rowsperpage: response.data.success.per_page })
        setTotalPage(response.data.success.total)
        setRowsPerPage(response.data.success.per_page)
      }
    })
  }, [page, updatedList])

  const handleValueChange = () => {
    if (oldUserList === null) {
      return
    }
    if (filterName.length === '') {
      setUSERLIST(oldUserList.user)
      setTotalPage(oldUserList.totalpage)
      setRowsPerPage(oldUserList.rowsperpage)
      return
    }
    axios.get("admin/users?search=" + filterName).then((response) => {
      if (response.data.success) {
        setUSERLIST([...response.data.success.data])
        setTotalPage(response.data.success.total)
        setRowsPerPage(response.data.success.per_page)
      }
    })
  }
  useEffect(() => {
    handleValueChange();

  }, [filterName]);


  const updated = (id) => {
    var index = USERLIST.findIndex((o) => {
      return o.id === Number(id);
    })
    if (index !== -1) {
      // setUpdatedList([index])
      setUSERLIST(USERLIST.splice(index, 1))
      setUSERLIST(USERLIST)
      setUpdatedList(id)
    };

  }


  if (USERLIST === null) {
    return (
      <Page title={"Vendors | " + process.env.REACT_APP_Name}>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              User
            </Typography>
            <Button
              variant="contained"

              onClick={() => { setAddNew(true) }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New User
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: "30vh" }}>
            <CircularProgress />
          </Stack>
        </Container>
      </Page>
    )
  }


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.id);
      setSelected(newSelecteds);

      return
    }

    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDelete = () => {
    window.confirm("Are you sure to delete?")
    const body = { id: selected }
    setBackdrop(true)
    axios.delete("/admin/users/delete", {
      params: {
        ...body
      }
    }).then((response) => {
      if (response.data) {
        setUpdatedList(response.data)

        if (response.data) {
          let updatedIndex = []
          response.data.forEach(element => {

            let id = element.id
            var index = USERLIST.findIndex((o) => {
              return o.id === Number(id);
            })
            if (index !== -1) {
              setUSERLIST(USERLIST.splice(index, 1))
              setUSERLIST(USERLIST)
              setUpdatedList(id)
            };


          });
          // setUpdatedList(updatedIndex)



        }


        setSelected([])
        setBackdrop(false)
      }
    })
  }
  const handleAddNew = () => {
    setAddNew(false)
  }
  const addedHandler = (id) => {
    setAddNew(false)
    setUpdatedList(id)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = USERLIST

  const isUserNotFound = filteredUsers.length === 0;

  return (

    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>


      <Page title={"Users | " + process.env.REACT_APP_Name}>
        <Container>

          <Newvendor updated={addedHandler} open={addNew} addNewClose={handleAddNew} />
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Users
            </Typography>
            <Button
              variant="contained"
              onClick={() => { setAddNew(true) }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New User
            </Button>
          </Stack>

          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              onDelete={handleDelete}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>

                <Table stickyHeader >
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />

                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { id, firstName, avatar, lastName, email, phone, authType, status, role } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;
                        return (
                          <TableRow
                            hover
                            key={uuid()}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">

                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, id)}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={firstName} src={getFilename(avatar, 50)} />
                                <Typography variant="subtitle2" noWrap>
                                  {firstName + " " + lastName}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{id}</TableCell>
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="left">{phone}</TableCell>
                            <TableCell align="left">{role}</TableCell>
                            <TableCell align="left">{sentenceCase(authType)}</TableCell>


                            <TableCell align="left">
                              <Label
                                variant="ghost"
                              >
                                {status !== null ? sentenceCase(status) : ""}
                              </Label>
                            </TableCell>


                            <TableCell align="right">
                              <IconButton component={RouterLink} to={"/dashboard/user/" + id}>
                                <Iconify icon="akar-icons:eye" />
                              </IconButton>
                            </TableCell>
                            <TableCell align="right">
                              <UserMoreMenu updated={(eid) => updated(eid)} id={id} />
                            </TableCell>
                          </TableRow>

                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              count={totalPage}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </Card>
        </Container>
      </Page >
    </>

  );
}
