import { createAction } from "@reduxjs/toolkit";

export const updateLoading = createAction('music/updateLoading');

export const updateInfo = createAction('music/updateInfo');

export const updateProgress = createAction('music/updateProgress');