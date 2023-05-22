import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";
import { FormEventHandler, MouseEvent, MouseEventHandler, ReactNode } from "react";
import { TextButton } from "../themed/ThemedButtons";

export type EditEventHandler = (event: MouseEvent<HTMLButtonElement>, index: number) => void;

interface EditSectionProps {
    /**
     * An index identifying the section.
     */
    index: number;
    /**
     * The index of the section being currently edited.
     */
    currentIndex: number | null;
    /**
     * A handler function for clicking the edit button.
     *
     * @param event - A mouse event passed down from OnClick.
     * @param index - The index value of the section.
     */
    onEdit: EditEventHandler;
    /**
     * A handler function for clicking the cancel button.
     * Passes down the mouse event.
     */
    onCancel: MouseEventHandler<HTMLButtonElement>;
    /**
     * A handler function for clicking the accept button.
     * Passes down the mouse event.
     */
    onSubmit: FormEventHandler<HTMLFormElement>;
    /**
     * The content inside the section.
     */
    children: ReactNode;
}
/**
 * EditSection component.
 *
 * A wrapper for content that has editable fields.
 * Displays children with an edit button by default.
 * When being edited, displays children with accept and cancel buttons instead.
 */
const EditSection: React.FC<EditSectionProps> = ({
    index,
    currentIndex,
    onEdit,
    onCancel,
    onSubmit,
    children,
}): JSX.Element => {
    const isInEditMode: boolean = index === currentIndex;
    const isEnabled: boolean = currentIndex === null;

    if (isInEditMode) {
        // Returns the content with accept and cancel buttons, at the bottom.
        return (
            <form onSubmit={onSubmit}>
                {children}
                <Stack>
                    <TextButton variant="text" onClick={onCancel}>
                        Cancelar
                    </TextButton>
                    <Button variant="contained" type="submit">
                        Guardar
                    </Button>
                </Stack>
            </form>
        );
    }

    // Returns the content with an edit button, at the bottom.
    // The edit button is disabled if a different section is being edited.
    return (
        <div>
            {children}
            <Box textAlign="end" mt={2}>
                <TextButton
                    variant="text"
                    startIcon={<Edit />}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => onEdit(e, index)}
                    disabled={!isEnabled}
                >
                    Editar
                </TextButton>
            </Box>
        </div>
    );
};

interface EditableProps {
    /**
     * The index of the edit section that the editable is in.
     */
    sectionIndex: number;
    /**
     * The index of the section being currently edited.
     */
    currentSectionIndex: number | null;
    /**
     * The input element to be displayed in edit mode.
     */
    inputElement: ReactNode;
    /**
     * The content inside the editable.
     */
    children: ReactNode;
}
/**
 * Editable component.
 *
 * A wrapper for content that can be edited.
 * Must be inside an EditSection component.
 * Displays children by default, or the input element when being edited.
 */
export const Editable: React.FC<EditableProps> = ({
    sectionIndex,
    currentSectionIndex,
    inputElement,
    children,
}): JSX.Element => {
    const isInEditMode: boolean = sectionIndex === currentSectionIndex;
    return <>{isInEditMode ? inputElement : children}</>;
};

export default EditSection;
