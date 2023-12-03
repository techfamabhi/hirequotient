import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchData = createAsyncThunk('fetchData', async () => {
    const response = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    return response.data;
});

const initialState = {
    users: [],
    selectedRows: [],
    editedUser: null, // Track the currently edited user
};

const crudOperation = createSlice({
    name: 'crudOperation',
    initialState,
    reducers: {
        selectRow: (state, action) => {
            const selectedId = action.payload;
            if (state.selectedRows.includes(selectedId)) {
                state.selectedRows = state.selectedRows.filter(id => id !== selectedId);
            } else {
                state.selectedRows.push(selectedId);
            }
        },
        deleteSelectedRows: (state) => {
            state.users = state.users.filter(user => !state.selectedRows.includes(user.id));
            state.selectedRows = [];
        },
        selectAllRows: (state) => {
            state.selectedRows = state.users.map(user => user.id);
        },
        deselectAllRows: (state) => {
            state.selectedRows = [];
        },
        deleteSingleRow: (state, action) => {
            const deletedUserId = action.payload;
            state.users = state.users.filter(user => user.id !== deletedUserId);
            state.selectedRows = state.selectedRows.filter(id => id !== deletedUserId);
            // Reset editedUser if the deleted user was being edited
            if (state.editedUser && state.editedUser.id === deletedUserId) {
                state.editedUser = null;
            }
        },
        startEditUser: (state, action) => {
            const userId = action.payload;
            state.editedUser = state.users.find(user => user.id === userId);
        },
        cancelEditUser: (state) => {
            state.editedUser = null;
        },
        saveEditedUser: (state, action) => {
            const editedUserData = action.payload;
            state.users = state.users.map(user =>
                user.id === editedUserData.id ? { ...user, ...editedUserData } : user
            );
            state.editedUser = null;
        },
    },
    extraReducers: {
        [fetchData.fulfilled]: (state, action) => {
            state.users = action.payload;
        },
    },
});

export const {
    selectRow,
    deleteSelectedRows,
    selectAllRows,
    deselectAllRows,
    deleteSingleRow,
    startEditUser,
    cancelEditUser,
    saveEditedUser,
} = crudOperation.actions;
export default crudOperation.reducer;
