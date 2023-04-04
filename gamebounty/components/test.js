 /* <div className="mt-4 mb-4 text-center">
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Review Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Game Title:</h5>
            <p>{selectedContract?.gameTitle.S}</p>
            <h5>Target Player:</h5>
            <p>{selectedContract?.targetPlayer.S}</p>
            <h5>Conditions:</h5>
            <p>{selectedContract?.contractConditions.S}</p>
            <h5>Expiriation Date:</h5>
            <p>{selectedContract?.expDate.S}</p>
            <h5>Bid Amount:</h5>
            <p>${selectedContract?.bidAmount.N}</p>
           </Modal.Body>
          <Modal.Footer>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button onClick={handleVerify} type="primary">Verify</Button>
                <Button onClick={handleReject} danger>Reject</Button>
                <Button onClick={handleClose}>Close</Button>
            </div>
          </Modal.Footer>
        </Modal> */