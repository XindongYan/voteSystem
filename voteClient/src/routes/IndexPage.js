import React from 'react';
import { connect } from 'dva';
// import styles from './IndexPage.css';
import { Layout, Breadcrumb, Menu, Card, List, Button, Icon, message, Modal, Input } from 'antd';
// import { routerRedux } from 'dva/router';
import { like } from '../services/example';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const confirm = Modal.confirm;

@connect(state => ({
  voteBackendContent: state.example.voteBackendContent
}))

export default class IndexPage extends React.PureComponent {

  state = { visible: false, value: '', id: '', code: '', detail: '' }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'example/fetchBackend',
      payload: {}
    });

  }

  hanldSubmit = (e) => {
    this.setState({
      visible: true,
      id: e
    });
  }

  handleOk = async (e) => {
    try {
      let result = await like({ id: this.state.id, code: this.state.value });
      if (result && result.data) {
        message.success('投票成功')
        this.props.dispatch({
          type: 'example/fetchBackend',
          payload: {}
        });

        this.setState({
          visible: false,
        });
      }
    } catch (error) {
      console.log(error)
      message.warn('投票频率过快请稍后再试')
    }

  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  showDetail = (e) => {
    console.log(e)
    this.setState({
      visible1: true,
      detail: e
    })
  }

  render() {

    const { voteBackendContent } = this.props;
    const { detail } = this.state;
    console.log(detail);

    return (
      <Layout>
        {/* 头 */}
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">参与投票</Menu.Item>
          </Menu>
        </Header>

        {/* 内容  */}
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>最美校园投票</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
            <List
              grid={{
                gutter: 32, column: 6
              }}
              dataSource={voteBackendContent.data.content}
              renderItem={item => (
                <List.Item>
                  <Card
                    hoverable
                    style={{ width: 240, height: 300 }}
                    cover={<img alt="example" src={`http://127.0.0.1:3000${item.imageUrl[0]}`} />}
                    // actions={}
                    onClick={e => this.showDetail(item)}
                  >
                    <Meta
                      title={item.name}
                      description={
                        <div style={{ textOverflow: 'elipsis' }}>
                          {item.desc}
                          <br />
                          <div style={{ textAlign: 'center', marginTop: 30, position: 'absolute', bottom: 15, marginLeft: 35 }}>
                            <Button onClick={e => this.hanldSubmit(item._id)}><Icon type="like" theme="twoTone" twoToneColor="#eb2f96" />{item.like} 投他一票</Button>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </Content>

        {/* 尾部 */}
        <Footer style={{ textAlign: 'center' }}>
          朱杰作品
        </Footer>

        <Modal
          title="输入验证码"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ margin: '0 auto', textAlign: 'center' }}
        >
          <Input style={{ width: '40%' }} onChange={(e) => { this.setState({ value: e.target.value }) }} />
          <img src="http://127.0.0.1:3000/api/verification" alt="验证码加载失败" />

        </Modal>

        <Modal
          title={detail.name + "同学作品"}
          visible={this.state.visible1}
          onOk={this.handleOk1}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          {JSON.stringify(detail)}
          {detail ?
            detail.imageUrl.forEach(item => {
              <img src={`http://127.0.0.1:3000${item.item}`} alt="图片加载失败" />
            })
          : ""
          }
        </Modal>

      </Layout>
    )
  }
}
