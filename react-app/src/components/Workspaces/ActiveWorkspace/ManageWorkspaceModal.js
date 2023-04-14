import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";
import { getWorkspaceByIdThunk } from "../../../store/workspace";
import "./ManageWorkspaceModal.css";

function ManageWorkspaceModal({ workspace }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleManageChannel = (e) => {
    e.preventDefault();
    history.push(`/dashboard/${workspace.Id}/manage`);
    closeModal();
  };

  const handleSignOutWorkspace = (e) => {
    e.preventDefault();
    history.push(``);
    closeModal();
  };

  return (
    <div className="workspace-modal-container">
      <div className="workspace-modal-top">
        <img
          src={workspace.icon}
          alt="Workspace Image"
          className="workspace-icon-modal"
          // this might want an active or not active class ternary to style letter for Profile pic
        />
        <div className="workspace-modal-name-desc-container">
          <div>
            {workspace.name}
            {/* {sessionUser.last_name} */}
          </div>
          <div className="status-container">
            <button className="status-button">
              a single place for your team and your work
            </button>
          </div>
        </div>
      </div>

      <button className="user-profile-button">{`Invite People to ${workspace.name} `}</button>

      <button
        className="user-icon-modal-sign-out-button"
        onClick={handleSignOutWorkspace}
      >
        {`Sign out of workspace`}
      </button>
    </div>
  );
}

export default ManageWorkspaceModal;
