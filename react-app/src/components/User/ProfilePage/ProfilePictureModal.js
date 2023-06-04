import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserThunk } from "../../../store/session";
import { useModal } from "../../../context/Modal";
import { refreshUser } from "../../../store/session";

function EditProfilePictureModal({ sessionUser }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [profilePicture, setProfilePicture] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { closeModal } = useModal();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(errors).length) {
      const userInformation = {
        username: sessionUser.username,
        email: sessionUser.email,
        password: sessionUser.password,
        first_name: sessionUser.first_name,
        last_name: sessionUser.last_name,
        profile_picture: profilePicture,
        title: sessionUser.title,
        about_me: sessionUser.about_me,
      };

      let updatedUser = await dispatch(
        updateUserThunk(userInformation, sessionUser.id)
      );
      dispatch(refreshUser(sessionUser.id));
      closeModal();
      history.push(`/profile/${updatedUser.id}`);
    }
    setHasSubmitted(true);
  };

  return (
    <div id="edit-profile-modal-wrapper">
      <h1 id="edit-modal-title-text-heading" className="title-text">Update profile picture</h1>
      <form className="profile-edit-container" onSubmit={handleFormSubmit}>
        <div className="profile-picture-label">
            <input
              className="text-input-login"
              type="text"
              value={profilePicture}
              placeholder="Image URL"
              onChange={(e) => setProfilePicture(e.target.value)}
            />
  
        </div>
    
        <input
          className="profile-edit-submit-button"
          type="submit"
          value={"Save Changes"}
          disabled={hasSubmitted && Object.values(errors).length > 0}
        />
      </form>
    </div>
  );
}

export default EditProfilePictureModal;
