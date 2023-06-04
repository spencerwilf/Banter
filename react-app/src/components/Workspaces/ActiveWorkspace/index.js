import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWorkspaceByIdThunk } from "../../../store/workspace";
import { useModal } from "../../../context/Modal";
import ManageWorkspaceModal from "./ManageWorkspaceModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faAngleDown, faCircleChevronDown } from "@fortawesome/free-solid-svg-icons";
import "../../Dashboard/Dashboard.css";
import { loadActiveWorkspace } from "../../../store/activeWorkspace";

const ActiveWorkspace = ({ workspaceId }) => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(getWorkspaceByIdThunk(workspaceId));
  }, [dispatch, workspaceId]);

  const activeWorkspace = useSelector((state) => state.workspaces);
  const newActiveWorkspace = activeWorkspace[workspaceId];

  if (!newActiveWorkspace) {
    return null;
  }

  const handleWorkspaceNameClick = () => {
    setModalContent(<ManageWorkspaceModal workspace={newActiveWorkspace} />);
    dispatch(loadActiveWorkspace(workspaceId));
  };

  return (
    <div className="workspace-upper-section">
      <button
      className="dashboard-workspace-name"
      onClick={handleWorkspaceNameClick}
    >
      <span className="workspace-and-icon-menu">
      {`${newActiveWorkspace.name}`}
      </span>
      <FontAwesomeIcon style={{fontSize:'14px'}} icon={faChevronDown}/>

    </button>
    {/* <div>Explore channels</div> */}
    </div>
);
};

export default ActiveWorkspace;
