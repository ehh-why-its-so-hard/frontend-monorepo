import pytest
from playwright.sync_api import Page, expect
from vega_sim.null_service import VegaServiceNull
from datetime import datetime, timedelta
from conftest import init_vega, cleanup_container
from fixtures.market import setup_continuous_market
from actions.vega import submit_order
from actions.utils import wait_for_toast_confirmation, change_keys
from wallet_config import PARTY_C, MM_WALLET

order_size = "order-size"
order_price = "order-price"
place_order = "place-order"
order_side_sell = "order-side-SIDE_SELL"
market_order = "order-type-Market"
tif = "order-tif"
expire = "expire"


@pytest.fixture(scope="module")
def vega(request):
    with init_vega(request) as vega_instance:
        request.addfinalizer(lambda: cleanup_container(vega_instance))
        yield vega_instance



@pytest.fixture(scope="module")
def continuous_market(vega):
    return setup_continuous_market(vega)


@pytest.mark.usefixtures("auth", "risk_accepted")
def test_limit_buy_order_GTT(continuous_market, vega: VegaServiceNull, page: Page):
    page.goto(f"/#/markets/{continuous_market}")
    page.get_by_test_id(tif).select_option("Good 'til Time (GTT)")
    page.get_by_test_id(order_size).fill("10")
    page.get_by_test_id(order_price).fill("120")
    expires_at = datetime.now() + timedelta(days=1)
    expires_at_input_value = expires_at.strftime("%Y-%m-%dT%H:%M:%S")
    page.get_by_test_id("date-picker-field").clear()
    page.get_by_test_id("date-picker-field").fill(expires_at_input_value)
    # 7002-SORD-011
    expect(page.get_by_test_id("place-order").locator("span").first).to_have_text(
        "Place limit order"
    )
    expect(page.get_by_test_id("place-order").locator("span").last).to_have_text(
        "10 BTC @ 120.00 BTC"
    )
    page.get_by_test_id(place_order).click()
    wait_for_toast_confirmation(page)
    vega.wait_fn(1)
    vega.wait_for_total_catchup()
    page.get_by_test_id("All").click()
    # 7002-SORD-017
    expect(page.get_by_role("row").nth(5)).to_contain_text("10+10LimitFilled120.00GTT:")


@pytest.mark.usefixtures("auth", "risk_accepted")
def test_limit_buy_order(continuous_market, vega: VegaServiceNull, page: Page):
    page.goto(f"/#/markets/{continuous_market}")
    page.get_by_test_id(order_size).fill("10")
    page.get_by_test_id(order_price).fill("120")
    page.get_by_test_id(place_order).click()
    wait_for_toast_confirmation(page)
    vega.wait_fn(2)
    vega.wait_for_total_catchup()
    page.get_by_test_id("All").click()
    # 7002-SORD-017
    expect(page.get_by_role("row").nth(6)).to_contain_text("10+10LimitFilled120.00GTC")


@pytest.mark.usefixtures("auth", "risk_accepted")
def test_limit_sell_order(continuous_market, vega: VegaServiceNull, page: Page):
    page.goto(f"/#/markets/{continuous_market}")
    page.get_by_test_id(order_size).fill("10")
    page.get_by_test_id(order_price).fill("100")
    page.get_by_test_id(order_side_sell).click()
    page.get_by_test_id(tif).select_option("Good for Normal (GFN)")
    # 7002-SORD-011
    expect(page.get_by_test_id("place-order").locator("span").first).to_have_text(
        "Place limit order"
    )
    expect(page.get_by_test_id("place-order").locator("span").last).to_have_text(
        "10 BTC @ 100.00 BTC"
    )
    page.get_by_test_id(place_order).click()
    wait_for_toast_confirmation(page)
    vega.wait_fn(1)
    vega.wait_for_total_catchup()
    page.get_by_test_id("All").click()
    expect(page.get_by_role("row").nth(7)).to_contain_text("10-10LimitFilled100.00GFN")


@pytest.mark.usefixtures("auth", "risk_accepted")
def test_market_sell_order(continuous_market, vega: VegaServiceNull, page: Page):
    page.goto(f"/#/markets/{continuous_market}")
    page.get_by_test_id(market_order).click()
    page.get_by_test_id(order_size).fill("10")
    page.get_by_test_id(order_side_sell).click()
    # 7002-SORD-011
    expect(page.get_by_test_id("place-order").locator("span").first).to_have_text(
        "Place market order"
    )
    expect(page.get_by_test_id("place-order").locator("span").last).to_have_text(
        "10 BTC @ market"
    )
    page.get_by_test_id(place_order).click()
    wait_for_toast_confirmation(page)
    vega.wait_fn(1)
    vega.wait_for_total_catchup()

    page.get_by_test_id("All").click()
    expect(page.get_by_role("row").nth(8)).to_contain_text("10-10MarketFilled-IOC")


@pytest.mark.usefixtures("auth", "risk_accepted")
def test_market_buy_order(continuous_market, vega: VegaServiceNull, page: Page):
    page.goto(f"/#/markets/{continuous_market}")
    page.get_by_test_id(market_order).click()
    page.get_by_test_id(order_size).fill("10")
    page.get_by_test_id(tif).select_option("Fill or Kill (FOK)")
    page.get_by_test_id(place_order).click()
    wait_for_toast_confirmation(page)
    vega.wait_fn(1)
    vega.wait_for_total_catchup()
    page.get_by_test_id("All").click()
    # 7002-SORD-010
    # 0003-WTXN-012
    # 0003-WTXN-003
    expect(page.get_by_role("row").nth(9)).to_contain_text("10+10MarketFilled-FOK")

@pytest.mark.usefixtures("risk_accepted")
def test_sidebar_should_be_open_after_reload(continuous_market, page: Page):
    page.goto(f"/#/markets/{continuous_market}")
    expect(page.get_by_test_id("deal-ticket-form")).to_be_visible()
    page.get_by_test_id("Order").click()
    expect(page.get_by_test_id("deal-ticket-form")).not_to_be_visible()
    page.reload()
    expect(page.get_by_test_id("deal-ticket-form")).to_be_visible()

@pytest.mark.skip("We currently can't approve wallet connection through Sim")
@pytest.mark.usefixtures("risk_accepted")
def test_connect_vega_wallet(continuous_market, page: Page):
    page.goto(f"/#/markets/{continuous_market}")
    page.get_by_test_id("order-price").fill("101")
    page.get_by_test_id("order-connect-wallet").click()
    expect(page.locator('[role="dialog"]')).to_be_visible()
    page.get_by_test_id("connector-jsonRpc").click()
    expect(page.get_by_test_id("wallet-dialog-title")).to_be_visible()
    # TODO: accept wallet connection and assert wallet is connected.
    expect(page.get_by_test_id("order-type-Limit")).to_be_checked()
    expect(page.get_by_test_id("order-price")).to_have_value("101")


@pytest.mark.usefixtures("auth", "risk_accepted")
def test_liquidated_tooltip(continuous_market, vega: VegaServiceNull, page: Page):
    tdai_id = vega.find_asset_id(symbol="tDAI")
    vega.mint(
        PARTY_C.name,
        asset=tdai_id,
        amount=20,
    )
    vega.wait_fn(1)
    vega.wait_for_total_catchup()
    submit_order(vega, PARTY_C.name, continuous_market, "SIDE_BUY", 1, 110)
    submit_order(vega, "Key 1", continuous_market, "SIDE_SELL", 1, 110)
    vega.wait_fn(1)
    vega.wait_for_total_catchup()
    page.goto(f"/#/markets/{continuous_market}")
    change_keys(page, vega, PARTY_C.name)
    submit_order(vega, MM_WALLET.name, continuous_market, "SIDE_BUY", 100, 90)
    submit_order(vega, "Key 1", continuous_market, "SIDE_SELL", 100, 90)
    vega.wait_fn(1)
    vega.wait_for_total_catchup()
    page.locator('[id="cell-openVolume-0"]').hover()
    expect(page.get_by_test_id("tooltip-content").first).to_contain_text("")
