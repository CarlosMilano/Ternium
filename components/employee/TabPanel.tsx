import { ReactNode } from "react";

interface TabPanelProps {
    /**
     * An index identifying the tab.
     */
    index: number;
    /**
     * The index of the current selected tab.
     */
    currentIndex: number;
    /**
     * The content inside the tab.
     */
    children: ReactNode;
}
/**
 * TabPanel component.
 *
 * A wrapper for tab content.
 * Displays children only if its index is selected.
 */
const TabPanel: React.FC<TabPanelProps> = ({ index, currentIndex, children }): JSX.Element => {
    const isOpened = index === currentIndex;
    return <div hidden={!isOpened}>{isOpened && children}</div>;
};

export default TabPanel;
