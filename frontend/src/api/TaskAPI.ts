import api from "@/lib/axios";
import { Project, Task, TaskFormData, taskSchema } from "../types";
import { handleErrorsAxios } from "@/lib/handleErrors";

type TaskAPI = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId : Task['_id']
    status : Task['status']
}

export async function createTask({formData, projectId} : Pick<TaskAPI, 'formData' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/tasks`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getTaskById({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.get(url)
        const response = taskSchema.safeParse(data)
        if(response.success){
            return response.data
        }

    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function updateTask({formData, projectId, taskId}: Pick<TaskAPI, 'formData'| 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.put<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function deleteTask({ projectId, taskId } : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.delete<string>(url)
        return data

    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function updateStatus({ projectId, taskId, status } : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`
        const { data } = await api.post<string>(url, {status})
        return data

    } catch (error) {
        handleErrorsAxios(error)
    }
}