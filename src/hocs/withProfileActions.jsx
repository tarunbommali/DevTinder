/* eslint-disable no-unused-vars */

const withProfileActions = (WrappedComponent) => {
  return ({ isOwnProfile = false, ...props }) => (
    <WrappedComponent
      isOwnProfile={isOwnProfile}
      showEditInsideCard={isOwnProfile}
      {...props}
    />
  );
};

export default withProfileActions;
