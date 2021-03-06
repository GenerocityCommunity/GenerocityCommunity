import React, { Component, Fragment } from 'react';
import AddItem from './AddItem';
import ItemCard from './ItemCard.jsx';
import EditItem from './EditItem';
import EditItemModal from './EditItemModal.jsx';
import '../scss/app.scss'; // would each page have different css?
const path = require('path');

// create local state for get request of user profile
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userItems: [],
    };
    // handleChange on edit of items
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleFileChange = this.handleFileChange.bind(this);
    this.getUserItems = this.getUserItems.bind(this);
    //
  }

  componentDidMount() {
    this.getUserItems();
  }

  //handle event click
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFileChange(e) {
    console.log('input Image:', e.target.value);
    this.setState({
      image: e.target.value,
    });
  }
  //

  /*--- GET request to get all items from server---- */
  getUserItems() {
    const url = '/user/';

    const id = this.props.info.user_id.toString();

    fetch(path.resolve(url, id))
      .then((res) => res.json())
      .then((res) => {
        this.setState({ userItems: res.allItems });
      })
      .catch((err) => {
        console.log('/item/user GET error: ', err);
      });
  }

  deleteItem(e) {
    const itemId = e.target.id.toString();
    const url = `/item/${itemId}`;
    fetch(url, { method: 'DELETE' }).catch((err) =>
      console.log('delete error', err)
    );
    // copy existing state
    let newUserItems = this.state.userItems.slice();
    // delete userItems.item_id that we passed in
    newUserItems.forEach((item, index) => {
      if (item._id === Number(itemId)) {
        newUserItems.splice(index, 1);
      }
    });
    // call setState and set state equal to new object
    this.setState({ userItems: newUserItems });
  }

  render() {
    const { latitude, longitude, firstName, lastName, email } = this.props.info;
    const { userItems } = this.state;
    const cards = userItems.map((item) => {
      return (
        <>
          <section className="card">
            <ItemCard
              item={item}
              name={item.title}
              user_id={item.itemuser_id}
              location={item.itemAddress}
              status={item.status}
              id={item._id}
            />
            <section className="cardItem">
              {/* <EditItem /> */}
              <button
                type="button"
                className="btn btn-dark editItemBtn"
                data-toggle="modal"
                data-target="#editItemModal"
                id={item._id}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-dark editItemBtn"
                id={item._id}
                onClick={(e) =>  this.deleteItem(e)}
              >
                Del
              </button>
            </section>
          </section>
        </>
      );
    });

    // Dynamic URL  (string interpolation) for google maps (static) api link
    let mapSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude}, ${longitude}&zoom=13&size=600x300&maptype=roadmap
    &markers=color:red%7C${latitude}, ${longitude}
    &key=${process.env.GOOGLE_API_KEY}`;

    return (
      <>
        <EditItemModal
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handleFileChange={this.handleFileChange}
        />
        {/* <div
          className="modal fade"
          id="editItemModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalScrollableTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  Edit Item
            </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditItem
                  handleChange={this.handleChange}
                  handleSubmit={this.handleSubmit}
                  handleFileChange={this.handleFileChange}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary loginAndSignUpBtn"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary loginAndSignUpBtn"
                  onClick={(e) => this.handleSubmit(e)}
                >
                  Edit Item
                </button>
              </div>
            </div >
          </div >
        </div > */}
{/* ___________________ ADD ITEM MODAL _________________*/}
        <section className="innerNav">
          <section className="userProfileTop">
            <h4>Welcome to Your Profile, {firstName}!</h4>
            <p>
              Name: {firstName} {lastName}
              <br />
              User Email: {email}
            </p>
          </section>
          <section className="rightNav">
            {/* <!-- Button trigger modal --> */}
            <button
              type="button"
              className="btn btn-dark addItemBtn"
              data-toggle="modal"
              data-target="#addItemModal"
            >
              Add Item
            </button>
          </section>
        </section>
        {/* <!!-- Modal Button - Display Content is in AddItem.jsx --!!> */}
        <div
          className="modal fade"
          id="addItemModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalScrollableTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  Add an Item
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddItem
                  handleChange={this.props.handleChange}
                  handleSubmit={this.props.handleSubmit}
                  handleFileChange={this.props.handleFileChange}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={(e) => this.props.handleSubmit(e)}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* if latitude and longitude do not exist in props, then render nothing
      if it does exist, then render map from Google API */}
        <br />
        <section className="leftNav" className="userProfile">
          {latitude && longitude ? <img src={mapSrc} alt="" /> : null}
          <br />
          <br />
          <br />
          <br />
          <br />
          <h5>Your listed items:</h5>
        </section>
        <section className="itemsContainer">{cards}</section>
      </>
    );
  }
}

export default Profile;
