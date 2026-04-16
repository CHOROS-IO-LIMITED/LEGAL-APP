@include('pdf.loan-agreement.components.clause-heading', [
    'number' => '25.',
    'title' => 'RAO EXEMPTION',
])

@include('pdf.loan-agreement.components.clause-row', [
    'number' => '',
    'text' =>
        'Both parties acknowledge and agree that this agreement does not constitute a regulated credit agreement for the purposes of the RAO, by virtue of one or more of the applicable exemptions set out in Article 60C of the RAO applying to this agreement and by virtue of this, this agreement does not constitute a regulated credit agreement and no party is therefore required to be authorised or exempt under the Financial Services and Markets Act 2000 in connection with the making or administration of this agreement.',
])
