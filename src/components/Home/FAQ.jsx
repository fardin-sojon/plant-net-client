import { Disclosure } from '@headlessui/react';
import { FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  return (
    <div className="w-full px-4 py-16 bg-base-200 rounded-2xl">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-base-100 p-2">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content">Frequently Asked Questions</h2>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-base-200 px-4 py-2 text-left text-sm font-medium text-base-content hover:bg-base-300 focus:outline-none focus-visible:ring focus-visible:ring-lime-500/75">
                <span>What is your return policy?</span>
                <FaChevronUp
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-lime-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-base-content/70">
                If you're unhappy with your purchase, valid returns are accepted within 30 days of receipt.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-base-200 px-4 py-2 text-left text-sm font-medium text-base-content hover:bg-base-300 focus:outline-none focus-visible:ring focus-visible:ring-lime-500/75">
                <span>Do you offer technical support?</span>
                <FaChevronUp
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-lime-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-base-content/70">
                No, we only sell plants. But we have a blog with tips!
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
         <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-base-200 px-4 py-2 text-left text-sm font-medium text-base-content hover:bg-base-300 focus:outline-none focus-visible:ring focus-visible:ring-lime-500/75">
                <span>How often should I water my plants?</span>
                <FaChevronUp
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-lime-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-base-content/70">
                It depends on the plant! Check the specific care instructions for your green friend. Generally, checking the top inch of soil is a good rule of thumb.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default FAQ;
