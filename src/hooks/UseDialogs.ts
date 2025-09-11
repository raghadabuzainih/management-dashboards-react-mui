import { useReducer, ActionDispatch } from "react"

type conditions = {
    isEditClicked: boolean,
    openSuccessEdited: boolean,
    openFailedEdited: boolean,
    isAddClicked: boolean,
    openSuccessAdded: boolean,
    openFailedAdded: boolean,
    isDeleteClicked: boolean,
    openSuccessDeleted: boolean
}

const initialValues: conditions = {
    isEditClicked: false,
    openSuccessEdited: false,
    openFailedEdited: false,
    isAddClicked: false,
    openSuccessAdded: false,
    openFailedAdded: false,
    isDeleteClicked: false,
    openSuccessDeleted: false
}

type dialogAction = {
    type: keyof conditions,
    value: boolean
}

export const useDialogs = () : [conditions, ActionDispatch<[dialogAction]>] => {
    const [dialogs, setDialogs] = useReducer(
        (state: conditions, action: dialogAction): conditions => ({
            ...state,
            [action.type]: action.value
        }),
        initialValues
    )
    return [dialogs, setDialogs]
}