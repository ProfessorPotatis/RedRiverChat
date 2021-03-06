import MediaDevice from './MediaDevice'
import Emitter from './Emitter'

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] }

/**
 * Create a PeerConnection.
 *
 * @author Jimmy
 */

class PeerConnection extends Emitter {
  constructor (friendID, connection) {
    super()
    this.pc = new RTCPeerConnection(PC_CONFIG)
    this.pc.onicecandidate = event => connection.invoke('createVideoCall', this.friendID, event.candidate)
    this.pc.onaddstream = event => this.emit('peerStream', event.stream)

    this.mediaDevice = new MediaDevice()
    this.friendID = friendID
    this.connection = connection
  }
  /**
   * Starting the call
   *
   * @author Jimmy
   */
  start (isCaller, config) {
    this.mediaDevice
      .on('stream', (stream) => {
        this.pc.addStream(stream)
        this.emit('localStream', stream)
        if (isCaller) this.connection.invoke('requestVideoCall', this.friendID)
        else this.createOffer()
      })
      .start(config)

    return this
  }
  /**
   * Stop the call
   *
   * @author Jimmy
   */
  stop (isStarter) {
    this.connection.invoke('endVideoCall', this.friendID)
    this.mediaDevice.stop()
    this.pc.close()
    this.pc = null
    this.off()
    return this
  }

  /**
   *  Create a webrtc offer to be sent to another user
   *
   *  @author Jimmy
   */

  createOffer () {
    this.pc.createOffer()
      .then(this.getDescription.bind(this))
      .catch(err => console.log(err))
    return this
  }

  /**
   *  Create a webrtc answer to reply when a offer is received.
   *
   *  @author Jimmy
   */

  createAnswer () {
    this.pc.createAnswer()
      .then(this.getDescription.bind(this))
      .catch(err => console.log(err))
    return this
  }

  /**
   *  Sets information (IP, Media format etc.) about the local user to
   *  be sent to the other peer.
   *
   *  @author Jimmy
   */

  getDescription (desc) {
    this.pc.setLocalDescription(desc)
    this.connection.invoke('createVideoCall', this.friendID, desc)
    return this
  }

  /**
   *  Sets information (IP, Media format etc.) about the connected peer.
   *
   *  @author Jimmy
   */

  setRemoteDescription (sdp) {
    const rtcSdp = new RTCSessionDescription(sdp)
    this.pc.setRemoteDescription(rtcSdp)
    return this
  }

  /**
   *  Add the to the P2P connection
   *
   *  @author Jimmy
   */

  addIceCandidate (candidate) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate)
      this.pc.addIceCandidate(iceCandidate)
    }
    return this
  }
}

export default PeerConnection
