import React, { PropTypes } from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import Post from './Post'
import {formatDate} from '../../utils'

export default class Comments extends React.Component {
  static propTypes = {
    article: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    onCommentPosted: PropTypes.func.isRequired,
    postArea: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      revertComment: null
    }
  }

  handleRevertClicked = (comment) => () => this.setState({revertComment: comment})

  makeComments = (comments, isChild = false) => comments.map(comment =>
    <Card className='comment' key={comment.ID} style={{
      backgroundColor: 'auto',
      width: isChild ? '90%' : '100%',
      marginLeft: isChild ? '3rem' : 'auto',
      marginTop: isChild ? '0.2rem' : '1rem',
      paddingBottom: '1rem'
    }}>
      <CardHeader title={
        <span>
          <a href={comment.HomePage} target='_blank' rel='nofollow'>{comment.Name}</a> at {formatDate(comment.PostTime)}
          <a style={{marginLeft: '1rem'}} href={'ja' + 'vascript:;'} onClick={this.handleRevertClicked(comment)}>[回复]</a>
        </span>
      }
        subtitle={
          <span className='useragent-js' data-useragent={comment.Agent} />
        }
        style={{
          paddingBottom: 0
        }}
        avatar={<Avatar style={{marginTop: 8}} src={comment.Avatar} />} />
      <CardText style={{
        paddingTop: 0,
        paddingBottom: 0,
        color: '#ffffff'
      }} dangerouslySetInnerHTML={{__html: comment.Content}} />
      {this.makeComments(comment.Comments, true)}
    </Card>
      )

  render () {
    return (<div>
      {this.makeComments(this.props.comments)}
      {this.props.postArea
        ? <Post article={this.props.article} onPosted={this.props.onCommentPosted} revertComment={this.state.revertComment} onRevertClicked={this.handleRevertClicked(null)} />
        : null}
    </div>)
  }
  /*
        <div>
        <span className='comment--name'></span>

        <span className='comment--revert'>回复</span>
      </div>
       */
}
