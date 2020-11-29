import Head from 'next/head'
import SiteLayout from '../components/SiteLayout'
import {PageTitle} from "../components/PageTitle/PageTitle";
import {Button} from "../components/Button/Button";
import Web3 from 'web3';
import {useState} from "react";
import {Modal} from "../components/Modal/Modal";
import * as React from "react";

const getWeb3Provider: () => Promise<Web3> = async () => {
    const provider = ('ethereum' in window) ? window['ethereum'] : Web3.givenProvider;
    if (!provider) {
        return Promise.reject('Could not detect a Web3 browsers.');
    }
    if (typeof provider['enable'] === 'function') {
        return provider.enable().then(() => {
            return new Web3(provider);
        })
    }
    return new Web3(provider);
}

function Tips() {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContents, setModalContents] = useState('');

    const tip = async () => {
        const [provider, error] = await getWeb3Provider().then(provider => [provider, undefined])
            .catch(error => [undefined, error]);

        if (error) {
            setModalContents(error.message);
            setModalOpen(true);
            return;
        }


        const accounts = await provider.eth.getAccounts();
        console.log(accounts);

        const benefactor = accounts[0];
        if (!benefactor) {
            setModalContents('Could not get your address, sorry');
            setModalOpen(true);
            return;
        }

        await provider.eth.sendTransaction({
            to: '0x74BBCfD98Ca5F762A24582c9CD1ea1249d167f00',
            from: benefactor,
            value: provider.utils.toWei('0.01', 'ether'),
        }).catch(error => {
            setModalContents('Transaction failed: ' + error.message);
            setModalOpen(true);
            return;
        });

        setModalContents('Thanks!');
        setModalOpen(true);
    };

    return (
        <SiteLayout>
            <Head>
                <title>Tips – Jérôme Velociter</title>
            </Head>

            <PageTitle>Tips</PageTitle>

            <Button onClick={tip}>Tip with Ethereum</Button>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                {modalContents}
            </Modal>

        </SiteLayout>
    )
}

export default Tips;