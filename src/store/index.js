import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootReducer from './reducers/rootReducer'; // This is your combined reducers

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['survey'] // You can choose which parts of your state are persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer
});

export const persistor = persistStore(store);